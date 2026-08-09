// packages/frontend/src/entities/dashboard-templates/model/store.test.ts
// Unit-тесты Zustand-стора dashboard-templates

import {
  useDashboardTemplatesStore,
  selectLoading,
  selectErrors,
  selectIsMounted,
  selectBunchesUpdated,
  selectOpened,
  selectSelectedId,
  selectStoredSelected,
  selectSelectedViewItem,
  selectSelectedTemplate,
  selectIsMainItem,
  selectIsUnsaved,
} from './store';
import { LS } from 'shared/lib/local-storage';
import type { StateSchemaDashboardTemplates } from './slice/state-schema';
import type { ViewItem } from 'entities/dashboard-view';
import type { Template } from './types';

// Мокаем LS
jest.mock('shared/lib/local-storage', () => ({
  LS: {
    getTemplates: jest.fn().mockReturnValue([]),
    setTemplates: jest.fn(),
    getTemplatesBunchesUpdated: jest.fn().mockReturnValue({}),
    setTemplatesBunchesUpdated: jest.fn(),
  },
}));

// Мокаем getError
jest.mock('shared/lib/errors', () => ({
  getPayloadError: jest.fn((errors) => {
    if (!errors) return {};
    return errors;
  }),
}));

// Мокаем api
jest.mock('shared/api', () => ({
  API_PATHS: {
    templates: {
      getBunchesUpdated: '/templates/getBunchesUpdated',
      getTemplates: '/templates/getTemplates',
      update: '/templates/update',
      delete: '/templates/delete',
    },
  },
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

// Мокаем утилиты
jest.mock('shared/lib/structures/view-items', () => ({
  getAllChildren: jest.fn((items: ViewItem[], id: string) => items.filter((i) => i.id === id)),
}));

const mockEnt = {
  t1: {
    id: 't1',
    type: 'box',
    bunchId: 'b1',
    viewItems: {
      v1: { id: 'v1', type: 'box', parentId: 't1', order: 0 } as unknown as ViewItem,
      v2: { id: 'v2', type: 'chart', parentId: 't1', order: 1 } as unknown as ViewItem,
    } as Record<string, ViewItem>,
  } as unknown as Template,
  t2: {
    id: 't2',
    type: 'sheet',
    bunchId: 'b2',
    viewItems: {
      v3: { id: 'v3', type: 'sheet', parentId: 't2', order: 0 } as unknown as ViewItem,
    } as Record<string, ViewItem>,
  } as unknown as Template,
};

const initialState: StateSchemaDashboardTemplates = {
  loading: false,
  errors: {},
  _isMounted: false,
  bunchesUpdated: undefined,
  entities: {},
  opened: false,
  selectedId: undefined,
  storedSelected: undefined,
};

describe('useDashboardTemplatesStore', () => {
  beforeEach(() => {
    useDashboardTemplatesStore.setState({ ...initialState });
    jest.clearAllMocks();
  });

  describe('initialState', () => {
    it('должен вернуть начальное состояние', () => {
      const state = useDashboardTemplatesStore.getState();
      expect(state.loading).toBe(false);
      expect(state.errors).toEqual({});
      expect(state._isMounted).toBe(false);
      expect(state.bunchesUpdated).toBeUndefined();
      expect(state.entities).toEqual({});
      expect(state.opened).toBe(false);
      expect(state.selectedId).toBeUndefined();
      expect(state.storedSelected).toBeUndefined();
    });
  });

  describe('setInitial', () => {
    it('должен полностью заменить состояние', () => {
      const newState: StateSchemaDashboardTemplates = {
        ...initialState,
        loading: true,
        entities: mockEnt,
        opened: true,
        selectedId: 't1',
      };

      useDashboardTemplatesStore.getState().setInitial(newState);

      const state = useDashboardTemplatesStore.getState();
      expect(state.loading).toBe(true);
      expect(state.entities).toEqual(mockEnt);
      expect(state.opened).toBe(true);
      expect(state.selectedId).toBe('t1');
    });
  });

  describe('setIsMounted', () => {
    it('должен установить _isMounted в true', () => {
      useDashboardTemplatesStore.getState().setIsMounted();
      expect(useDashboardTemplatesStore.getState()._isMounted).toBe(true);
    });
  });

  describe('setErrors / clearErrors', () => {
    it('должен установить ошибки', () => {
      const errors = { general: 'Тестовая ошибка' };
      useDashboardTemplatesStore.getState().setErrors(errors);
      expect(useDashboardTemplatesStore.getState().errors).toEqual(errors);
    });

    it('должен очистить ошибки', () => {
      useDashboardTemplatesStore.setState({ errors: { general: 'Ошибка' } });
      useDashboardTemplatesStore.getState().clearErrors();
      expect(useDashboardTemplatesStore.getState().errors).toEqual({});
    });

    it('должен установить пустые errors при undefined', () => {
      useDashboardTemplatesStore.getState().setErrors(undefined);
      expect(useDashboardTemplatesStore.getState().errors).toEqual({});
    });
  });

  describe('setDashboardTemplatesFromCache', () => {
    it('должен загрузить templates из LS и обновить entities', () => {
      const cachedTemplates = [mockEnt.t1];
      (LS.getTemplates as jest.Mock).mockReturnValue(cachedTemplates);

      useDashboardTemplatesStore.getState().setDashboardTemplatesFromCache();

      const state = useDashboardTemplatesStore.getState();
      expect(state.entities).toEqual({ t1: mockEnt.t1 });
      expect(LS.getTemplates).toHaveBeenCalled();
    });

    it('не должен падать если LS вернул falsy', () => {
      (LS.getTemplates as jest.Mock).mockReturnValue(null);

      // Не должен упасть
      expect(() => {
        useDashboardTemplatesStore.getState().setDashboardTemplatesFromCache();
      }).not.toThrow();
    });
  });

  describe('setOpened', () => {
    it('должен открыть окно шаблонов', () => {
      useDashboardTemplatesStore.getState().setOpened(true);
      expect(useDashboardTemplatesStore.getState().opened).toBe(true);
    });

    it('должен закрыть окно шаблонов', () => {
      useDashboardTemplatesStore.setState({ opened: true });
      useDashboardTemplatesStore.getState().setOpened(false);
      expect(useDashboardTemplatesStore.getState().opened).toBe(false);
    });
  });

  describe('setSelectedId', () => {
    it('должен установить selectedId', () => {
      useDashboardTemplatesStore.getState().setSelectedId('t1');
      expect(useDashboardTemplatesStore.getState().selectedId).toBe('t1');
    });
  });

  describe('activateMainViewItem', () => {
    it('должен установить selectedId в id главного ViewItem', () => {
      useDashboardTemplatesStore.setState({
        entities: mockEnt,
        selectedId: 'v1',
      });

      useDashboardTemplatesStore.getState().activateMainViewItem();

      // findMainViewItemById для v1: template=t1, ищем viewItem с parentId='t1' → v1
      // (v1.parentId === t1.id)
      const state = useDashboardTemplatesStore.getState();
      expect(state.selectedId).toBe('v1');
    });
  });

  describe('deleteSelectedViewItem', () => {
    it('должен удалить выбранный viewItem и его детей из entities', () => {
      useDashboardTemplatesStore.setState({
        entities: mockEnt,
        selectedId: 'v1',
      });

      useDashboardTemplatesStore.getState().deleteSelectedViewItem();

      const state = useDashboardTemplatesStore.getState();
      // viewItem v1 должен быть удалён (getAllChildren мокается, возвращает [], getArrWithoutArr уберёт v1)
      // Но getArrWithoutArr работает с реальным массивом, а getAllChildren замокан на [],
      // значит дети не удалятся, но v1 должен удалиться т.к. он в viewItems но не в children
      // Проверим что v1 больше не в viewItems
      // eslint-disable-next-line dot-notation
      expect(state.entities['t1'].viewItems['v1']).toBeUndefined();
    });

    it('не должен падать если нет templateId', () => {
      useDashboardTemplatesStore.setState({
        entities: mockEnt,
        selectedId: 'nonexistent',
      });

      expect(() => {
        useDashboardTemplatesStore.getState().deleteSelectedViewItem();
      }).not.toThrow();
    });
  });

  describe('cancelUpdateTemplate', () => {
    it('должен восстановить template из storedSelected', () => {
      const originalTemplate = {
        ...mockEnt.t1,
        viewItems: { v1: { id: 'v1', type: 'box', parentId: 't1', order: 999 } as unknown as ViewItem },
      };
      const modifiedTemplate = {
        ...mockEnt.t1,
        viewItems: {
          v1: { id: 'v1', type: 'box', parentId: 't1', order: 0 } as unknown as ViewItem,
          v2: { id: 'v2', type: 'chart', parentId: 't1', order: 1 } as unknown as ViewItem,
        },
      };

      useDashboardTemplatesStore.setState({
        entities: { t1: modifiedTemplate },
        storedSelected: originalTemplate,
        selectedId: 't1',
      });

      useDashboardTemplatesStore.getState().cancelUpdateTemplate();

      const state = useDashboardTemplatesStore.getState();
      // eslint-disable-next-line dot-notation
      expect(state.entities['t1']).toEqual(originalTemplate);
    });

    it('не должен ничего делать если нет storedSelected', () => {
      useDashboardTemplatesStore.setState({
        entities: mockEnt,
        storedSelected: undefined,
      });

      const before = useDashboardTemplatesStore.getState().entities;
      useDashboardTemplatesStore.getState().cancelUpdateTemplate();
      expect(useDashboardTemplatesStore.getState().entities).toEqual(before);
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      useDashboardTemplatesStore.setState({
        loading: true,
        errors: { general: 'error' },
        _isMounted: true,
        bunchesUpdated: { b1: 123 },
        entities: mockEnt,
        opened: true,
        selectedId: 'v1',
        storedSelected: mockEnt.t1,
      });
    });

    it('selectLoading должен вернуть loading', () => {
      expect(selectLoading(useDashboardTemplatesStore.getState())).toBe(true);
    });

    it('selectErrors должен вернуть errors', () => {
      expect(selectErrors(useDashboardTemplatesStore.getState())).toEqual({ general: 'error' });
    });

    it('selectIsMounted должен вернуть _isMounted', () => {
      expect(selectIsMounted(useDashboardTemplatesStore.getState())).toBe(true);
    });

    it('selectBunchesUpdated должен вернуть bunchesUpdated', () => {
      expect(selectBunchesUpdated(useDashboardTemplatesStore.getState())).toEqual({ b1: 123 });
    });

    it('selectOpened должен вернуть opened', () => {
      expect(selectOpened(useDashboardTemplatesStore.getState())).toBe(true);
    });

    it('selectSelectedId должен вернуть selectedId', () => {
      expect(selectSelectedId(useDashboardTemplatesStore.getState())).toBe('v1');
    });

    it('selectStoredSelected должен вернуть storedSelected', () => {
      expect(selectStoredSelected(useDashboardTemplatesStore.getState())).toEqual(mockEnt.t1);
    });

    it('selectSelectedViewItem должен вернуть корневой viewItem текущего template', () => {
      const vi = selectSelectedViewItem(useDashboardTemplatesStore.getState());
      // findMainViewItemById: for 'v1' → template=t1, viewItem c parentId='t1' → v1
      expect(vi?.id).toBe('v1');
    });

    it('selectSelectedTemplate должен вернуть template по selectedId', () => {
      const t = selectSelectedTemplate(useDashboardTemplatesStore.getState());
      // findTemplateBySelectedId: v1 есть в t1.viewItems → возвращает t1
      expect(t?.id).toBe('t1');
    });

    it('selectIsMainItem должен вернуть true если selected.parentId === template.id', () => {
      // template = t1, selected = v1, v1.parentId === 't1' === t1.id → true
      const result = selectIsMainItem(useDashboardTemplatesStore.getState());
      expect(result).toBe(true);
    });

    it('selectIsUnsaved должен вернуть false если storedSelected равен текущему', () => {
      const result = selectIsUnsaved(useDashboardTemplatesStore.getState());
      expect(result).toBe(false);
    });

    it('selectIsUnsaved должен вернуть true если storedSelected отличается', () => {
      const modifiedTemplate = { ...mockEnt.t1, type: 'modified' as any };
      useDashboardTemplatesStore.setState({ entities: { t1: modifiedTemplate } });
      const result = selectIsUnsaved(useDashboardTemplatesStore.getState());
      expect(result).toBe(true);
    });
  });
});
