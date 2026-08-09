// packages/frontend/src/entities/dashboard-view/model/slice/tests/slice.test.ts

/* eslint-disable @typescript-eslint/naming-convention */
import { configureStore } from '@reduxjs/toolkit';
import { slice, actions } from '../index';
import type { StateSchemaDashboardView } from '../state-schema';
import type { ViewItem } from '../../../types';
import type { BunchesViewItem } from '../../../types/view-item';
import { LS } from 'shared/lib/local-storage';
import { updateEntities } from 'entities/base';
import { getViewitemsFromBunches } from '../../../model/utils/get-viewitems-from-bunches';
import { getBunchesWithoutChanges } from '../../../model/utils/get-bunches-without-changes';

// Мокаем LS
jest.mock('shared/lib/local-storage', () => ({
  LS: {
    getEditMode: jest.fn(() => false),
    setEditMode: jest.fn(),
    getBunches: jest.fn(() => ({})),
    setBunches: jest.fn(),
    setViewBunchesUpdated: jest.fn(),
    getViewBunchesUpdated: jest.fn(() => ({})),
  },
}));

// Мокаем утилиты
jest.mock('../../../model/utils/get-viewitems-from-bunches', () => ({
  getViewitemsFromBunches: jest.fn(() => []),
}));

jest.mock('../../../model/utils/get-bunches-without-changes', () => ({
  getBunchesWithoutChanges: jest.fn((changed: string[], cached: any) => cached || {}),
}));

jest.mock('entities/base', () => ({
  updateEntities: jest.fn((entities, items) => {
    const result = { ...entities };
    (Array.isArray(items) ? items : [items]).forEach((item: ViewItem) => {
      result[item.id] = item;
    });
    return result;
  }),
}));

// Мокаем createAsyncThunk'и
jest.mock('../../services', () => ({
  getBunches: {
    pending: { type: 'entities/dashboardView/getBunches/pending' },
    fulfilled: { type: 'entities/dashboardView/getBunches/fulfilled' },
    rejected: { type: 'entities/dashboardView/getBunches/rejected' },
  },
}));

jest.mock('shared/api/features/dashboard-view', () => ({
  createGroupViewItems: {
    pending: { type: 'entities/dashboardView/createGroupViewItems/pending' },
    fulfilled: { type: 'entities/dashboardView/createGroupViewItems/fulfilled' },
    rejected: { type: 'entities/dashboardView/createGroupViewItems/rejected' },
  },
  updateViewItems: {
    pending: { type: 'entities/dashboardView/updateViewItems/pending' },
    fulfilled: { type: 'entities/dashboardView/updateViewItems/fulfilled' },
    rejected: { type: 'entities/dashboardView/updateViewItems/rejected' },
  },
  deleteViewItem: {
    pending: { type: 'entities/dashboardView/deleteViewItem/pending' },
    fulfilled: { type: 'entities/dashboardView/deleteViewItem/fulfilled' },
    rejected: { type: 'entities/dashboardView/deleteViewItem/rejected' },
  },
}));

// Фабрика ViewItem
const createMockViewItem = (overrides: Partial<ViewItem> = {}): ViewItem =>
  ({
    id: 'vi-001',
    bunchId: 'bunch-001',
    parentId: 'no_parentId',
    sheetId: '',
    type: 'box',
    styles: {},
    settings: {},
    order: 1,
    globalKod: 'testKod',
    label: 'Test Item',
    kod: 'testKod',
    kodLabel: 'Test Label',
    parentChildren: [],
    ...overrides,
  }) as ViewItem;

// Фабрика состояния
const createInitialState = (overrides: Partial<StateSchemaDashboardView> = {}): StateSchemaDashboardView => ({
  loading: false,
  errors: {},
  _isMounted: false,
  _isLoaded: false,
  editMode: false,
  entities: {},
  newSelectedId: '',
  selectedId: '',
  bright: false,
  isUnsaved: false,
  newStoredViewItem: undefined,
  prevStoredViewItem: undefined,
  activatedMovementId: '',
  activatedCopied: undefined,
  ...overrides,
});

// Фабрика store
const createTestStore = (initialState: StateSchemaDashboardView) =>
  configureStore({
    reducer: { dashboardView: slice.reducer },
    preloadedState: { dashboardView: initialState },
  });

describe('dashboardView slice (Redux)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================
  // 1. initialState
  // ============================================================
  describe('initialState', () => {
    it('возвращает корректное начальное состояние', () => {
      const store = createTestStore(createInitialState());
      const state = store.getState().dashboardView;

      expect(state.loading).toBe(false);
      expect(state.errors).toEqual({});
      expect(state._isMounted).toBe(false);
      expect(state._isLoaded).toBe(false);
      expect(state.editMode).toBe(false);
      expect(state.entities).toEqual({});
      expect(state.selectedId).toBe('');
      expect(state.bright).toBe(false);
      expect(state.isUnsaved).toBe(false);
      expect(state.activatedMovementId).toBe('');
      expect(state.activatedCopied).toBeUndefined();
    });
  });

  // ============================================================
  // 2. setInitial
  // ============================================================
  describe('setInitial', () => {
    it('устанавливает переданное состояние', () => {
      const store = createTestStore(createInitialState());
      const newState: StateSchemaDashboardView = {
        ...createInitialState(),
        entities: { 'vi-001': createMockViewItem({ id: 'vi-001', type: 'chart' }) },
        selectedId: 'vi-001',
        loading: true,
        errors: { general: 'test error' },
      };

      store.dispatch(actions.setInitial(newState));
      const state = store.getState().dashboardView;

      expect(state.entities['vi-001']).toBeDefined();
      expect(state.entities['vi-001'].type).toBe('chart');
      expect(state.selectedId).toBe('vi-001');
      expect(state.loading).toBe(true);
      expect(state.errors.general).toBe('test error');
    });

    it('не ломается при передаче пустого объекта', () => {
      const store = createTestStore(createInitialState());
      store.dispatch(actions.setInitial({} as StateSchemaDashboardView));
      const state = store.getState().dashboardView;
      // Должен остаться валидным состоянием
      expect(state.entities).toEqual({});
      // selectedId может быть undefined при отсутствии в payload
      expect(state.selectedId === '' || state.selectedId === undefined).toBe(true);
    });
  });

  // ============================================================
  // 3. setIsMounted
  // ============================================================
  describe('setIsMounted', () => {
    it('устанавливает _isMounted в true', () => {
      const store = createTestStore(createInitialState());
      expect(store.getState().dashboardView._isMounted).toBe(false);

      store.dispatch(actions.setIsMounted());
      expect(store.getState().dashboardView._isMounted).toBe(true);
    });
  });

  // ============================================================
  // 4. setErrors / clearErrors
  // ============================================================
  describe('setErrors', () => {
    it('устанавливает ошибки', () => {
      const store = createTestStore(createInitialState());
      store.dispatch(actions.setErrors({ general: 'error message' }));
      const state = store.getState().dashboardView;
      expect(state.errors.general).toBe('error message');
    });

    it('очищает ошибки при передаче пустого объекта', () => {
      const store = createTestStore(
        createInitialState({
          errors: { general: 'old error' },
        }),
      );
      store.dispatch(actions.setErrors({}));
      const state = store.getState().dashboardView;
      expect(state.errors).toEqual({});
    });
  });

  // ============================================================
  // 5. setDashboardViewItems
  // ============================================================
  describe('setDashboardViewItems', () => {
    it('добавляет ViewItems в entities и сбрасывает activatedMovementId/activatedCopied', () => {
      const store = createTestStore(
        createInitialState({
          activatedMovementId: 'old-movement',
          activatedCopied: { type: 'copyItemFirstOnly', id: 'old-copy' },
          bright: true,
        }),
      );

      const viewItems: ViewItem[] = [
        createMockViewItem({ id: 'vi-001', type: 'text' }),
        createMockViewItem({ id: 'vi-002', type: 'chart' }),
      ];

      store.dispatch(
        actions.setDashboardViewItems({
          companyId: 'comp-1',
          viewItems,
          bunchesUpdated: {},
        }),
      );

      const state = store.getState().dashboardView;
      expect(state.entities['vi-001']).toBeDefined();
      expect(state.entities['vi-002']).toBeDefined();
      expect(state.activatedMovementId).toBe('');
      expect(state.activatedCopied).toBeUndefined();
      expect(state.bright).toBe(false);
    });
  });

  // ============================================================
  // 6. setDashboardBunchesFromCache
  // ============================================================
  describe('setDashboardBunchesFromCache', () => {
    it('восстанавливает ViewItems из кэша LS', () => {
      const cachedBunches: BunchesViewItem = {
        'bunch-001': {
          'vi-cached': createMockViewItem({ id: 'vi-cached', type: 'icon' }),
        },
      };
      (LS.getBunches as jest.Mock).mockReturnValue(cachedBunches);

      const store = createTestStore(
        createInitialState({
          activatedMovementId: 'old-movement',
          activatedCopied: { type: 'copyStyles', id: 'old-copy' },
        }),
      );

      store.dispatch(
        actions.setDashboardBunchesFromCache({
          changedBunches: ['bunch-changed'],
          companyId: 'comp-1',
        }),
      );

      const state = store.getState().dashboardView;
      expect(state.activatedMovementId).toBe('');
      expect(state.activatedCopied).toBeUndefined();
      expect(state.bright).toBe(false);
    });

    it('работает с пустым кэшем', () => {
      (LS.getBunches as jest.Mock).mockReturnValue(undefined);
      const store = createTestStore(createInitialState());

      store.dispatch(
        actions.setDashboardBunchesFromCache({
          changedBunches: [],
          companyId: 'comp-1',
        }),
      );

      const state = store.getState().dashboardView;
      expect(state.entities).toEqual({});
    });
  });

  // ============================================================
  // 7. setEditMode
  // ============================================================
  describe('setEditMode', () => {
    it('включает режим редактирования и сохраняет в LS', () => {
      const store = createTestStore(createInitialState());

      store.dispatch(actions.setEditMode({ editMode: true, companyId: 'comp-1' }));
      const state = store.getState().dashboardView;
      expect(state.editMode).toBe(true);
      expect(LS.setEditMode).toHaveBeenCalledWith('comp-1', true);
    });

    it('выключает режим редактирования и сбрасывает selectedId', () => {
      const store = createTestStore(
        createInitialState({
          editMode: true,
          selectedId: 'vi-001',
        }),
      );

      store.dispatch(actions.setEditMode({ editMode: false, companyId: 'comp-1' }));
      const state = store.getState().dashboardView;
      expect(state.editMode).toBe(false);
      expect(state.selectedId).toBe('');
      expect(LS.setEditMode).toHaveBeenCalledWith('comp-1', false);
    });
  });

  // ============================================================
  // 8. setNewSelectedId
  // ============================================================
  describe('setNewSelectedId', () => {
    it('устанавливает newSelectedId', () => {
      const store = createTestStore(createInitialState());
      store.dispatch(actions.setNewSelectedId('vi-new'));
      expect(store.getState().dashboardView.newSelectedId).toBe('vi-new');
    });
  });

  // ============================================================
  // 9. setSelectedId
  // ============================================================
  describe('setSelectedId', () => {
    it('устанавливает selectedId и переносит newStoredViewItem в prevStoredViewItem', () => {
      const newItem = createMockViewItem({ id: 'vi-001', type: 'text' });
      const store = createTestStore(
        createInitialState({
          entities: { 'vi-001': newItem },
          newStoredViewItem: { ...newItem, type: 'chart' },
          newSelectedId: 'vi-001',
        }),
      );

      store.dispatch(actions.setSelectedId('vi-001'));
      const state = store.getState().dashboardView;

      expect(state.selectedId).toBe('vi-001');
      expect(state.newSelectedId).toBe('');
      expect(state.bright).toBe(false);
      // prevStoredViewItem получает значение из newStoredViewItem
      expect(state.prevStoredViewItem?.type).toBe('chart');
      // newStoredViewItem берётся из entities
      expect(state.newStoredViewItem?.id).toBe('vi-001');
    });

    it('работает с пустым entities', () => {
      const store = createTestStore(createInitialState());
      store.dispatch(actions.setSelectedId('non-existent'));
      const state = store.getState().dashboardView;
      expect(state.selectedId).toBe('non-existent');
      expect(state.newStoredViewItem).toEqual({});
    });
  });

  // ============================================================
  // 10. setBright
  // ============================================================
  describe('setBright', () => {
    it('устанавливает bright в true', () => {
      const store = createTestStore(createInitialState());
      store.dispatch(actions.setBright(true));
      expect(store.getState().dashboardView.bright).toBe(true);
    });

    it('устанавливает bright в false', () => {
      const store = createTestStore(createInitialState({ bright: true }));
      store.dispatch(actions.setBright(false));
      expect(store.getState().dashboardView.bright).toBe(false);
    });
  });

  // ============================================================
  // 11. setIsUnsaved
  // ============================================================
  describe('setIsUnsaved', () => {
    it('помечает наличие несохранённых изменений', () => {
      const store = createTestStore(createInitialState());
      store.dispatch(actions.setIsUnsaved(true));
      expect(store.getState().dashboardView.isUnsaved).toBe(true);
    });
  });

  // ============================================================
  // 12. setActiveMovementId / clearActivatedMovementId
  // ============================================================
  describe('setActiveMovementId / clearActivatedMovementId', () => {
    it('активирует перемещение выбранного элемента', () => {
      const store = createTestStore(
        createInitialState({
          selectedId: 'vi-001',
          activatedCopied: { type: 'copyItemFirstOnly', id: 'vi-copy' },
          bright: true,
        }),
      );

      store.dispatch(actions.setActiveMovementId());
      const state = store.getState().dashboardView;
      expect(state.activatedMovementId).toBe('vi-001');
      expect(state.activatedCopied).toBeUndefined();
      expect(state.bright).toBe(false);
    });

    it('очищает activatedMovementId', () => {
      const store = createTestStore(
        createInitialState({
          activatedMovementId: 'vi-001',
          activatedCopied: { type: 'copyStyles', id: 'vi-copy' },
          bright: true,
        }),
      );

      store.dispatch(actions.clearActivatedMovementId());
      const state = store.getState().dashboardView;
      expect(state.activatedMovementId).toBe('');
      expect(state.activatedCopied).toBeUndefined();
      expect(state.bright).toBe(false);
    });
  });

  // ============================================================
  // 13. setActiveCopied / clearActivatedCopied
  // ============================================================
  describe('setActiveCopied / clearActivatedCopied', () => {
    it('активирует копирование элемента', () => {
      const store = createTestStore(
        createInitialState({
          activatedMovementId: 'vi-move',
          bright: true,
        }),
      );

      store.dispatch(actions.setActiveCopied({ type: 'copyItemFirstOnly', id: 'vi-copy' }));
      const state = store.getState().dashboardView;
      expect(state.activatedMovementId).toBe('');
      expect(state.activatedCopied).toEqual({ type: 'copyItemFirstOnly', id: 'vi-copy' });
      expect(state.bright).toBe(false);
    });

    it('очищает activatedCopied', () => {
      const store = createTestStore(
        createInitialState({
          activatedMovementId: 'vi-move',
          activatedCopied: { type: 'copyItemsAll', id: 'vi-copy' },
          bright: true,
        }),
      );

      store.dispatch(actions.clearActivatedCopied());
      const state = store.getState().dashboardView;
      expect(state.activatedMovementId).toBe('');
      expect(state.activatedCopied).toBeUndefined();
      expect(state.bright).toBe(false);
    });
  });

  // ============================================================
  // 14. updateViewItems
  // ============================================================
  describe('updateViewItems', () => {
    it('обновляет entities частичными данными', () => {
      const existing = createMockViewItem({ id: 'vi-001', type: 'box', styles: { width: 100 } });
      const store = createTestStore(
        createInitialState({
          entities: { 'vi-001': existing },
          activatedMovementId: 'vi-move',
          activatedCopied: { type: 'copyStyles', id: 'vi-copy' },
          bright: true,
        }),
      );

      store.dispatch(actions.updateViewItems([{ id: 'vi-001', type: 'chart', styles: { width: 100 } } as ViewItem]));
      const state = store.getState().dashboardView;
      // type обновился на chart
      expect(state.entities['vi-001'].type).toBe('chart');
      // styles сохранились (передаём явно, т.к. updateEntities мокается)
      expect(state.entities['vi-001']?.styles?.width).toBe(100);
      expect(state.activatedMovementId).toBe('');
      expect(state.activatedCopied).toBeUndefined();
      expect(state.bright).toBe(false);
    });
  });

  // ============================================================
  // 15. cancelUpdateViewItem
  // ============================================================
  describe('cancelUpdateViewItem', () => {
    it('восстанавливает состояние из newStoredViewItem', () => {
      const original = createMockViewItem({ id: 'vi-001', type: 'box', styles: { width: 100 } });
      const store = createTestStore(
        createInitialState({
          entities: { 'vi-001': createMockViewItem({ id: 'vi-001', type: 'chart', styles: { width: 200 } }) },
          selectedId: 'vi-001',
          newStoredViewItem: original,
          errors: {},
        }),
      );

      store.dispatch(actions.cancelUpdateViewItem());
      const state = store.getState().dashboardView;
      expect(state.entities['vi-001'].type).toBe('box');
      expect(state.entities['vi-001'].styles.width).toBe(100);
    });

    it('восстанавливает из prevStoredViewItem при наличии ошибок', () => {
      const prevStored = createMockViewItem({ id: 'vi-001', type: 'text', styles: { width: 50 } });
      const store = createTestStore(
        createInitialState({
          entities: { 'vi-001': createMockViewItem({ id: 'vi-001', type: 'chart', styles: { width: 200 } }) },
          selectedId: 'vi-001',
          newStoredViewItem: undefined,
          prevStoredViewItem: prevStored,
          errors: { general: 'error' },
        }),
      );

      store.dispatch(actions.cancelUpdateViewItem());
      const state = store.getState().dashboardView;
      expect(state.entities['vi-001'].type).toBe('text');
      expect(state.entities['vi-001'].styles.width).toBe(50);
      expect(state.newStoredViewItem?.type).toBe('text');
    });

    it('не ломается при отсутствии данных для восстановления', () => {
      const store = createTestStore(
        createInitialState({
          entities: { 'vi-001': createMockViewItem({ id: 'vi-001', type: 'chart' }) },
          selectedId: 'vi-001',
          newStoredViewItem: undefined,
          prevStoredViewItem: undefined,
          errors: {},
        }),
      );

      expect(() => store.dispatch(actions.cancelUpdateViewItem())).not.toThrow();
    });
  });

  // ============================================================
  // 16. changeOneStyleField
  // ============================================================
  describe('changeOneStyleField', () => {
    it('изменяет одно поле стилей выбранного элемента', () => {
      const store = createTestStore(
        createInitialState({
          entities: { 'vi-001': createMockViewItem({ id: 'vi-001', type: 'box', styles: {} }) },
          selectedId: 'vi-001',
        }),
      );

      store.dispatch(actions.changeOneStyleField({ field: 'width', value: 500, funcName: 'testFunc' }));
      const state = store.getState().dashboardView;
      expect(state.entities['vi-001'].styles.width).toBe(500);
    });

    it('создаёт styles, если его нет', () => {
      const store = createTestStore(
        createInitialState({
          entities: { 'vi-001': createMockViewItem({ id: 'vi-001', type: 'box', styles: undefined as any }) },
          selectedId: 'vi-001',
        }),
      );

      store.dispatch(actions.changeOneStyleField({ field: 'height', value: 300, funcName: 'test' }));
      const state = store.getState().dashboardView;
      expect(state.entities['vi-001'].styles.height).toBe(300);
    });

    it('не ломается, если selectedId не существует', () => {
      const store = createTestStore(createInitialState());
      expect(() =>
        store.dispatch(actions.changeOneStyleField({ field: 'width', value: 100, funcName: 'test' })),
      ).not.toThrow();
    });
  });

  // ============================================================
  // 17. setSelectedStyles
  // ============================================================
  describe('setSelectedStyles', () => {
    it('устанавливает стили выбранного элемента', () => {
      const store = createTestStore(
        createInitialState({
          entities: { 'vi-001': createMockViewItem({ id: 'vi-001', type: 'box', styles: { width: 100 } }) },
          selectedId: 'vi-001',
        }),
      );

      store.dispatch(actions.setSelectedStyles({ width: 999, height: 555 }));
      const state = store.getState().dashboardView;
      expect(state.entities['vi-001'].styles.width).toBe(999);
      expect(state.entities['vi-001'].styles.height).toBe(555);
    });
  });

  // ============================================================
  // 18. changeOneSettingsField
  // ============================================================
  describe('changeOneSettingsField', () => {
    it('изменяет одно поле настроек выбранного элемента', () => {
      const store = createTestStore(
        createInitialState({
          entities: { 'vi-001': createMockViewItem({ id: 'vi-001', type: 'chart', settings: {} }) },
          selectedId: 'vi-001',
        }),
      );

      store.dispatch(actions.changeOneSettingsField({ field: 'chipType', value: 'company' }));
      const state = store.getState().dashboardView;
      expect(state.entities['vi-001']?.settings?.chipType).toBe('company');
    });

    it('создаёт settings, если его нет', () => {
      const store = createTestStore(
        createInitialState({
          entities: { 'vi-001': createMockViewItem({ id: 'vi-001', type: 'box', settings: undefined as any }) },
          selectedId: 'vi-001',
        }),
      );

      store.dispatch(actions.changeOneSettingsField({ field: 'chipType', value: 'company' }));
      const state = store.getState().dashboardView;
      expect(state.entities['vi-001']?.settings?.chipType).toBe('company');
    });
  });

  // ============================================================
  // 19. changeOneChartsItem
  // ============================================================
  describe('changeOneChartsItem', () => {
    it('изменяет поле в settings.charts[index]', () => {
      const store = createTestStore(
        createInitialState({
          entities: {
            'vi-001': createMockViewItem({
              id: 'vi-001',
              type: 'chart',
              settings: { charts: [{ chartType: 'line' }, { chartType: 'bar' }] },
            }),
          },
          selectedId: 'vi-001',
        }),
      );

      store.dispatch(actions.changeOneChartsItem({ field: 'chartType' as any, index: 0, value: 'pie' }));
      const state = store.getState().dashboardView;
      expect(state.entities['vi-001']?.settings?.charts?.[0]?.chartType).toBe('pie');
      // Второй график не изменился
      expect(state.entities['vi-001']?.settings?.charts?.[1]?.chartType).toBe('bar');
    });

    it('создаёт settings при необходимости', () => {
      const store = createTestStore(
        createInitialState({
          entities: { 'vi-001': createMockViewItem({ id: 'vi-001', type: 'chart' }) },
          selectedId: 'vi-001',
        }),
      );

      store.dispatch(actions.changeOneChartsItem({ field: 'chartType' as any, index: 0, value: 'line' }));
      const state = store.getState().dashboardView;
      expect(state.entities['vi-001']?.settings).toBeDefined();
    });
  });

  // ============================================================
  // 20. changeOneDatasetsItem
  // ============================================================
  describe('changeOneDatasetsItem', () => {
    it('изменяет поле в settings.charts[index].datasets', () => {
      const store = createTestStore(
        createInitialState({
          entities: {
            'vi-001': createMockViewItem({
              id: 'vi-001',
              type: 'chart',
              settings: {
                charts: [
                  {
                    chartType: 'line',
                    datasets: { label: 'old', data: [1, 2, 3] },
                  },
                ],
              },
            }),
          },
          selectedId: 'vi-001',
        }),
      );

      store.dispatch(actions.changeOneDatasetsItem({ field: 'label' as any, index: 0, value: 'new label' }));
      const state = store.getState().dashboardView;
      const chart = state.entities['vi-001']?.settings?.charts?.[0] as any;
      expect(chart?.datasets?.label).toBe('new label');
      // data сохранился
      expect(chart?.datasets?.data).toEqual([1, 2, 3]);
    });
  });

  // ============================================================
  // 21. ExtraReducers: getBunches
  // ============================================================
  describe('extraReducers: getBunches', () => {
    const getBunchesPending = { type: 'entities/dashboardView/getBunches/pending' };
    const getBunchesFulfilled = (payload: any) => ({
      type: 'entities/dashboardView/getBunches/fulfilled',
      payload,
    });
    const getBunchesRejected = (payload: any) => ({
      type: 'entities/dashboardView/getBunches/rejected',
      payload,
    });

    it('pending: устанавливает loading=true и очищает errors', () => {
      const store = createTestStore(createInitialState({ errors: { old: 'error' } }));
      store.dispatch(getBunchesPending);
      const state = store.getState().dashboardView;
      expect(state.loading).toBe(true);
      expect(state.errors).toEqual({});
    });

    it('fulfilled: заполняет entities и сохраняет в LS', () => {
      const store = createTestStore(createInitialState({ isUnsaved: true }));
      const payload = {
        companyId: 'comp-1',
        bunches: {
          'bunch-001': {
            'vi-001': createMockViewItem({ id: 'vi-001', type: 'text' }),
          },
        },
        bunchesUpdated: { 'bunch-001': 1234567890 },
      };

      store.dispatch(getBunchesFulfilled(payload));
      const state = store.getState().dashboardView;
      expect(state._isLoaded).toBe(true);
      expect(state.loading).toBe(false);
      expect(state.isUnsaved).toBe(false);
      expect(state.activatedMovementId).toBe('');
      expect(state.activatedCopied).toBeUndefined();
      expect(state.bright).toBe(false);
      expect(state.errors).toEqual({});
      expect(LS.setBunches).toHaveBeenCalledWith('comp-1', expect.any(Object));
      expect(LS.setViewBunchesUpdated).toHaveBeenCalledWith('comp-1', expect.any(Object));
    });

    it('rejected: устанавливает ошибки и loading=false', () => {
      const store = createTestStore(createInitialState({ loading: true }));
      store.dispatch(getBunchesRejected({ general: 'network error' }));
      const state = store.getState().dashboardView;
      expect(state.loading).toBe(false);
      expect(state.errors.general).toBe('network error');
    });
  });

  // ============================================================
  // 22. ExtraReducers: createGroupViewItems
  // ============================================================
  describe('extraReducers: createGroupViewItems', () => {
    const createPending = { type: 'entities/dashboardView/createGroupViewItems/pending' };
    const createFulfilled = (payload: any) => ({
      type: 'entities/dashboardView/createGroupViewItems/fulfilled',
      payload,
    });
    const createRejected = (payload: any) => ({
      type: 'entities/dashboardView/createGroupViewItems/rejected',
      payload,
    });

    it('pending: устанавливает loading=true', () => {
      const store = createTestStore(createInitialState());
      store.dispatch(createPending);
      expect(store.getState().dashboardView.loading).toBe(true);
    });

    it('fulfilled: обновляет entities и сохраняет в LS', () => {
      const store = createTestStore(createInitialState({ isUnsaved: true }));
      const payload = {
        viewItems: [createMockViewItem({ id: 'vi-new', type: 'chart' })],
        companyId: 'comp-1',
        bunchUpdatedMs: 1234567890,
      };

      store.dispatch(createFulfilled(payload));
      const state = store.getState().dashboardView;
      expect(state.entities['vi-new']).toBeDefined();
      expect(state.loading).toBe(false);
      expect(state.activatedMovementId).toBe('');
      expect(state.activatedCopied).toBeUndefined();
      expect(state.bright).toBe(false);
    });

    it('rejected: устанавливает ошибки', () => {
      const store = createTestStore(createInitialState());
      store.dispatch(createRejected({ general: 'creation failed' }));
      const state = store.getState().dashboardView;
      expect(state.loading).toBe(false);
      expect(state.errors.general).toBe('creation failed');
    });
  });

  // ============================================================
  // 23. ExtraReducers: updateViewItems (async)
  // ============================================================
  describe('extraReducers: updateViewItems (async)', () => {
    const updatePending = { type: 'entities/dashboardView/updateViewItems/pending' };
    const updateFulfilled = (payload: any) => ({
      type: 'entities/dashboardView/updateViewItems/fulfilled',
      payload,
    });
    const updateRejected = (payload: any) => ({
      type: 'entities/dashboardView/updateViewItems/rejected',
      payload,
    });

    it('pending: устанавливает loading=true', () => {
      const store = createTestStore(createInitialState());
      store.dispatch(updatePending);
      expect(store.getState().dashboardView.loading).toBe(true);
    });

    it('fulfilled: обновляет entities, newStoredViewItem и сбрасывает isUnsaved', () => {
      const store = createTestStore(
        createInitialState({
          entities: { 'vi-001': createMockViewItem({ id: 'vi-001', type: 'box' }) },
          newStoredViewItem: createMockViewItem({ id: 'vi-001', type: 'box' }),
          isUnsaved: true,
        }),
      );

      const payload = {
        viewItems: [createMockViewItem({ id: 'vi-001', type: 'chart' })],
        companyId: 'comp-1',
        newStoredViewItem: { id: 'vi-001', type: 'updated' },
        bunchUpdatedMs: 1234567890,
      };

      store.dispatch(updateFulfilled(payload));
      const state = store.getState().dashboardView;
      // entities обновлён
      expect(state.entities['vi-001'].type).toBe('chart');
      // newStoredViewItem обновлён
      expect(state.newStoredViewItem?.type).toBe('updated');
      expect(state.isUnsaved).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.activatedMovementId).toBe('');
    });

    it('rejected: сохраняет prevStoredViewItem и сбрасывает newStoredViewItem', () => {
      const store = createTestStore(
        createInitialState({
          newStoredViewItem: createMockViewItem({ id: 'vi-001', type: 'box' }),
        }),
      );

      store.dispatch(updateRejected({ general: 'update failed' }));
      const state = store.getState().dashboardView;
      expect(state.loading).toBe(false);
      // prevStoredViewItem = бывший newStoredViewItem
      expect(state.prevStoredViewItem?.id).toBe('vi-001');
      expect(state.prevStoredViewItem?.type).toBe('box');
      // newStoredViewItem сброшен
      expect(state.newStoredViewItem).toBeUndefined();
      expect(state.errors.general).toBe('update failed');
    });
  });

  // ============================================================
  // 24. ExtraReducers: deleteViewItem
  // ============================================================
  describe('extraReducers: deleteViewItem', () => {
    const deletePending = { type: 'entities/dashboardView/deleteViewItem/pending' };
    const deleteFulfilled = (payload: any) => ({
      type: 'entities/dashboardView/deleteViewItem/fulfilled',
      payload,
    });
    const deleteRejected = (payload: any) => ({
      type: 'entities/dashboardView/deleteViewItem/rejected',
      payload,
    });

    it('pending: устанавливает loading=true', () => {
      const store = createTestStore(createInitialState());
      store.dispatch(deletePending);
      expect(store.getState().dashboardView.loading).toBe(true);
    });

    it('fulfilled: удаляет viewItems из entities и сбрасывает selectedId', () => {
      const store = createTestStore(
        createInitialState({
          entities: {
            'vi-001': createMockViewItem({ id: 'vi-001', type: 'box' }),
            'vi-002': createMockViewItem({ id: 'vi-002', type: 'text' }),
          },
          selectedId: 'vi-001',
          newStoredViewItem: createMockViewItem({ id: 'vi-001', type: 'box' }),
          isUnsaved: true,
        }),
      );

      store.dispatch(
        deleteFulfilled({
          companyId: 'comp-1',
          viewItems: [createMockViewItem({ id: 'vi-001', type: 'box' })],
          bunchUpdatedMs: 1234567890,
        }),
      );

      const state = store.getState().dashboardView;
      // vi-001 удалён
      expect(state.entities['vi-001']).toBeUndefined();
      // vi-002 остался
      expect(state.entities['vi-002']).toBeDefined();
      expect(state.selectedId).toBe('');
      expect(state.newStoredViewItem).toBeUndefined();
      expect(state.prevStoredViewItem).toBeUndefined();
      expect(state.isUnsaved).toBe(false);
      expect(state.loading).toBe(false);
    });

    it('rejected: устанавливает ошибки', () => {
      const store = createTestStore(createInitialState());
      store.dispatch(deleteRejected({ general: 'delete failed' }));
      const state = store.getState().dashboardView;
      expect(state.loading).toBe(false);
      expect(state.errors.general).toBe('delete failed');
    });
  });
});
