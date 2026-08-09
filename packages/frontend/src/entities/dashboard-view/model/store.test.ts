// packages/frontend/src/entities/dashboard-view/model/store.test.ts
// Unit-тесты для Zustand-стора dashboard-view
// Основаны на тестах Redux-слайса (slice/tests/slice.test.ts)

import { useDashboardViewStore } from './store';
import type { StateSchemaDashboardView } from './state-schema';
import type { ViewItem } from '../types';
import { LS } from 'shared/lib/local-storage';

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

// Мокаем updateEntities
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
jest.mock('./services', () => ({
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

describe('dashboardView Zustand store', () => {
  beforeEach(() => {
    // Сбрасываем стор перед каждым тестом
    useDashboardViewStore.setState({
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
    });
    jest.clearAllMocks();
  });

  // ============================================================
  // 1. initialState
  // ============================================================
  describe('initialState', () => {
    it('возвращает корректное начальное состояние', () => {
      const state = useDashboardViewStore.getState();

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
      useDashboardViewStore.getState().setInitial({
        loading: true,
        errors: { general: 'test error' },
        _isMounted: false,
        _isLoaded: false,
        editMode: false,
        entities: { 'vi-001': createMockViewItem({ id: 'vi-001', type: 'chart' }) },
        newSelectedId: '',
        selectedId: 'vi-001',
        bright: false,
        isUnsaved: false,
        newStoredViewItem: undefined,
        prevStoredViewItem: undefined,
        activatedMovementId: '',
        activatedCopied: undefined,
      });

      const state = useDashboardViewStore.getState();
      expect(state.entities['vi-001']).toBeDefined();
      expect(state.entities['vi-001'].type).toBe('chart');
      expect(state.selectedId).toBe('vi-001');
      expect(state.loading).toBe(true);
      expect(state.errors.general).toBe('test error');
    });

    it('не ломается при передаче пустого объекта', () => {
      useDashboardViewStore.getState().setInitial({} as StateSchemaDashboardView);
      const state = useDashboardViewStore.getState();
      expect(state.entities).toEqual({});
    });
  });

  // ============================================================
  // 3. setIsMounted
  // ============================================================
  describe('setIsMounted', () => {
    it('устанавливает _isMounted в true', () => {
      expect(useDashboardViewStore.getState()._isMounted).toBe(false);
      useDashboardViewStore.getState().setIsMounted();
      expect(useDashboardViewStore.getState()._isMounted).toBe(true);
    });
  });

  // ============================================================
  // 4. setErrors / clearErrors
  // ============================================================
  describe('setErrors / clearErrors', () => {
    it('устанавливает ошибки', () => {
      useDashboardViewStore.getState().setErrors({ general: 'error message' });
      const state = useDashboardViewStore.getState();
      expect(state.errors.general).toBe('error message');
    });

    it('очищает ошибки', () => {
      useDashboardViewStore.setState({ errors: { general: 'old error' } });
      useDashboardViewStore.getState().clearErrors();
      expect(useDashboardViewStore.getState().errors).toEqual({});
    });
  });

  // ============================================================
  // 5. setDashboardViewItems
  // ============================================================
  describe('setDashboardViewItems', () => {
    it('добавляет ViewItems в entities и сбрасывает activatedMovementId/activatedCopied', () => {
      const viewItems: ViewItem[] = [
        createMockViewItem({ id: 'vi-001', type: 'text' }),
        createMockViewItem({ id: 'vi-002', type: 'chart' }),
      ];

      useDashboardViewStore.getState().setDashboardViewItems({
        companyId: 'comp-1',
        viewItems,
        bunchesUpdated: {},
      });

      const state = useDashboardViewStore.getState();
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
      (LS.getBunches as jest.Mock).mockReturnValue({
        'bunch-001': {
          'vi-cached': createMockViewItem({ id: 'vi-cached', type: 'icon' }),
        },
      });

      useDashboardViewStore.getState().setDashboardBunchesFromCache({
        changedBunches: ['bunch-changed'],
        companyId: 'comp-1',
      });

      const state = useDashboardViewStore.getState();
      expect(state.activatedMovementId).toBe('');
      expect(state.activatedCopied).toBeUndefined();
      expect(state.bright).toBe(false);
    });
  });

  // ============================================================
  // 7. setEditMode
  // ============================================================
  describe('setEditMode', () => {
    it('включает режим редактирования и сохраняет в LS', () => {
      useDashboardViewStore.getState().setEditMode({ editMode: true, companyId: 'comp-1' });
      const state = useDashboardViewStore.getState();
      expect(state.editMode).toBe(true);
      expect(LS.setEditMode).toHaveBeenCalledWith('comp-1', true);
    });

    it('выключает режим редактирования и сбрасывает selectedId', () => {
      useDashboardViewStore.setState({ editMode: true, selectedId: 'vi-001' });

      useDashboardViewStore.getState().setEditMode({ editMode: false, companyId: 'comp-1' });
      const state = useDashboardViewStore.getState();
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
      useDashboardViewStore.getState().setNewSelectedId('vi-new');
      expect(useDashboardViewStore.getState().newSelectedId).toBe('vi-new');
    });
  });

  // ============================================================
  // 9. setSelectedId
  // ============================================================
  describe('setSelectedId', () => {
    it('устанавливает selectedId и переносит newStoredViewItem в prevStoredViewItem', () => {
      const newItem = createMockViewItem({ id: 'vi-001', type: 'text' });
      useDashboardViewStore.setState({
        entities: { 'vi-001': newItem },
        newStoredViewItem: { ...newItem, type: 'chart' },
        newSelectedId: 'vi-001',
      });

      useDashboardViewStore.getState().setSelectedId('vi-001');
      const state = useDashboardViewStore.getState();

      expect(state.selectedId).toBe('vi-001');
      expect(state.newSelectedId).toBe('');
      expect(state.bright).toBe(false);
      expect(state.prevStoredViewItem?.type).toBe('chart');
      expect(state.newStoredViewItem?.id).toBe('vi-001');
    });
  });

  // ============================================================
  // 10. setBright
  // ============================================================
  describe('setBright', () => {
    it('устанавливает bright в true/false', () => {
      useDashboardViewStore.getState().setBright(true);
      expect(useDashboardViewStore.getState().bright).toBe(true);
      useDashboardViewStore.getState().setBright(false);
      expect(useDashboardViewStore.getState().bright).toBe(false);
    });
  });

  // ============================================================
  // 11. setIsUnsaved
  // ============================================================
  describe('setIsUnsaved', () => {
    it('помечает наличие несохранённых изменений', () => {
      useDashboardViewStore.getState().setIsUnsaved(true);
      expect(useDashboardViewStore.getState().isUnsaved).toBe(true);
    });
  });

  // ============================================================
  // 12–13. Movement / Copying
  // ============================================================
  describe('setActiveMovementId / clearActivatedMovementId', () => {
    it('активирует и очищает перемещение', () => {
      useDashboardViewStore.setState({
        selectedId: 'vi-001',
        bright: true,
        activatedCopied: { type: 'copyItemFirstOnly', id: 'vi-copy' },
      });

      useDashboardViewStore.getState().setActiveMovementId();
      let state = useDashboardViewStore.getState();
      expect(state.activatedMovementId).toBe('vi-001');
      expect(state.activatedCopied).toBeUndefined();
      expect(state.bright).toBe(false);

      useDashboardViewStore.getState().clearActivatedMovementId();
      state = useDashboardViewStore.getState();
      expect(state.activatedMovementId).toBe('');
      expect(state.activatedCopied).toBeUndefined();
      expect(state.bright).toBe(false);
    });
  });

  describe('setActiveCopied / clearActivatedCopied', () => {
    it('активирует и очищает копирование', () => {
      useDashboardViewStore.setState({ activatedMovementId: 'vi-move', bright: true });

      useDashboardViewStore.getState().setActiveCopied({ type: 'copyItemFirstOnly', id: 'vi-copy' });
      let state = useDashboardViewStore.getState();
      expect(state.activatedMovementId).toBe('');
      expect(state.activatedCopied).toEqual({ type: 'copyItemFirstOnly', id: 'vi-copy' });
      expect(state.bright).toBe(false);

      useDashboardViewStore.getState().clearActivatedCopied();
      state = useDashboardViewStore.getState();
      expect(state.activatedMovementId).toBe('');
      expect(state.activatedCopied).toBeUndefined();
      expect(state.bright).toBe(false);
    });
  });

  // ============================================================
  // 14. updateViewItems (sync)
  // ============================================================
  describe('updateViewItems', () => {
    it('обновляет entities частичными данными', () => {
      const existing = createMockViewItem({ id: 'vi-001', type: 'box', styles: { width: 100 } });
      useDashboardViewStore.setState({
        entities: { 'vi-001': existing },
        activatedMovementId: 'vi-move',
        activatedCopied: { type: 'copyStyles', id: 'vi-copy' },
        bright: true,
      });

      useDashboardViewStore
        .getState()
        .updateViewItems([{ id: 'vi-001', type: 'chart', styles: { width: 100 } } as ViewItem]);
      const state = useDashboardViewStore.getState();
      expect(state.entities['vi-001'].type).toBe('chart');
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
      useDashboardViewStore.setState({
        entities: { 'vi-001': createMockViewItem({ id: 'vi-001', type: 'chart', styles: { width: 200 } }) },
        selectedId: 'vi-001',
        newStoredViewItem: original,
        errors: {},
      });

      useDashboardViewStore.getState().cancelUpdateViewItem();
      const state = useDashboardViewStore.getState();
      expect(state.entities['vi-001'].type).toBe('box');
      expect(state.entities['vi-001'].styles.width).toBe(100);
    });

    it('восстанавливает из prevStoredViewItem при наличии ошибок', () => {
      const prevStored = createMockViewItem({ id: 'vi-001', type: 'text', styles: { width: 50 } });
      useDashboardViewStore.setState({
        entities: { 'vi-001': createMockViewItem({ id: 'vi-001', type: 'chart', styles: { width: 200 } }) },
        selectedId: 'vi-001',
        newStoredViewItem: undefined,
        prevStoredViewItem: prevStored,
        errors: { general: 'error' },
      });

      useDashboardViewStore.getState().cancelUpdateViewItem();
      const state = useDashboardViewStore.getState();
      expect(state.entities['vi-001'].type).toBe('text');
      expect(state.entities['vi-001'].styles.width).toBe(50);
      expect(state.newStoredViewItem?.type).toBe('text');
    });
  });

  // ============================================================
  // 16. changeOneStyleField
  // ============================================================
  describe('changeOneStyleField', () => {
    it('изменяет одно поле стилей выбранного элемента', () => {
      useDashboardViewStore.setState({
        entities: { 'vi-001': createMockViewItem({ id: 'vi-001', type: 'box', styles: {} }) },
        selectedId: 'vi-001',
      });

      useDashboardViewStore.getState().changeOneStyleField({ field: 'width', value: 500, funcName: 'testFunc' });
      const state = useDashboardViewStore.getState();
      expect(state.entities['vi-001'].styles.width).toBe(500);
    });

    it('создаёт styles, если его нет', () => {
      useDashboardViewStore.setState({
        entities: { 'vi-001': createMockViewItem({ id: 'vi-001', type: 'box', styles: undefined as any }) },
        selectedId: 'vi-001',
      });

      useDashboardViewStore.getState().changeOneStyleField({ field: 'height', value: 300, funcName: 'test' });
      const state = useDashboardViewStore.getState();
      expect(state.entities['vi-001'].styles.height).toBe(300);
    });
  });

  // ============================================================
  // 17. setSelectedStyles
  // ============================================================
  describe('setSelectedStyles', () => {
    it('устанавливает стили выбранного элемента', () => {
      useDashboardViewStore.setState({
        entities: { 'vi-001': createMockViewItem({ id: 'vi-001', type: 'box', styles: { width: 100 } }) },
        selectedId: 'vi-001',
      });

      useDashboardViewStore.getState().setSelectedStyles({ width: 999, height: 555 });
      const state = useDashboardViewStore.getState();
      expect(state.entities['vi-001'].styles.width).toBe(999);
      expect(state.entities['vi-001'].styles.height).toBe(555);
    });
  });

  // ============================================================
  // 18. changeOneSettingsField
  // ============================================================
  describe('changeOneSettingsField', () => {
    it('изменяет настройки выбранного элемента', () => {
      useDashboardViewStore.setState({
        entities: { 'vi-001': createMockViewItem({ id: 'vi-001', type: 'chart', settings: {} }) },
        selectedId: 'vi-001',
      });

      useDashboardViewStore.getState().changeOneSettingsField({ field: 'chipType', value: 'company' });
      const state = useDashboardViewStore.getState();
      expect(state.entities['vi-001']?.settings?.chipType).toBe('company');
    });
  });

  // ============================================================
  // 19. changeOneChartsItem
  // ============================================================
  describe('changeOneChartsItem', () => {
    it('изменяет поле в charts выбранного элемента', () => {
      useDashboardViewStore.setState({
        entities: {
          'vi-001': createMockViewItem({
            id: 'vi-001',
            type: 'chart',
            settings: { charts: [{ chartType: 'line' }, { chartType: 'bar' }] },
          }),
        },
        selectedId: 'vi-001',
      });

      useDashboardViewStore.getState().changeOneChartsItem({ field: 'chartType' as any, index: 0, value: 'pie' });
      const state = useDashboardViewStore.getState();
      expect(state.entities['vi-001']?.settings?.charts?.[0]?.chartType).toBe('pie');
      expect(state.entities['vi-001']?.settings?.charts?.[1]?.chartType).toBe('bar');
    });
  });

  // ============================================================
  // 20. changeOneDatasetsItem
  // ============================================================
  describe('changeOneDatasetsItem', () => {
    it('изменяет поле в datasets выбранного элемента', () => {
      useDashboardViewStore.setState({
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
      });

      useDashboardViewStore.getState().changeOneDatasetsItem({ field: 'label' as any, index: 0, value: 'new label' });
      const state = useDashboardViewStore.getState();
      const chart = state.entities['vi-001']?.settings?.charts?.[0] as any;
      expect(chart?.datasets?.label).toBe('new label');
      expect(chart?.datasets?.data).toEqual([1, 2, 3]);
    });
  });
});
