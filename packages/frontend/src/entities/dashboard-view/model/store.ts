// packages/frontend/src/entities/dashboard-view/model/store.ts
// Zustand-стор для dashboard-view, заменяет Redux-слайс
// Создан в рамках миграции 3.3.8

import { create } from 'zustand';
import { updateEntities } from 'entities/base';
import { LS } from 'shared/lib/local-storage';
import { getPayloadError as getError } from 'shared/lib/errors';
import { updateObject, cloneObj, isNotEmpty } from 'shared/helpers/objects';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { api, API_PATHS } from 'shared/api';
import cfg from 'app/config';
import type { ViewItem, ViewItemId, PartialViewItem, ViewItemStyles, BunchesViewItem } from '../types';
import { getViewitemsFromBunches } from './utils/get-viewitems-from-bunches';
import { getBunchesWithoutChanges } from './utils/get-bunches-without-changes';
import { getBunchesFromViewItems } from './utils/get-bunches-from-viewitems';
import { getBunchesTimestamps } from './utils/get-bunches-timestamps';
import { updateBunches } from './utils/update-bunches';
import { updateChartsItem } from './utils/update-charts-item';
import type {
  StateSchemaDashboardView,
  ActivatedCopiedType,
  SetEditMode,
  SetDashboardViewItems,
  ChangeSelectedStyle,
  ChangeOneSettingsField,
  ChangeOneChartsItem,
  ChangeOneDatasetsItem,
  SetDashboardBunchesFromCache,
} from './state-schema';
import type { UpdateViewItems, DeleteViews } from 'shared/api/features/dashboard-view';
import { createGroupViewItems as createGroupViewItemsApi } from 'shared/api/features/dashboard-view';
import type { Errors } from 'shared/lib/validators';
import type { ReqGetBunches } from './services';

// ============================================================
// Фабрика начального состояния
// ============================================================
const createInitialState = (): StateSchemaDashboardView => ({
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

// ============================================================
// Интерфейс стора
// ============================================================
interface DashboardViewActions {
  // Синхронные действия
  setInitial: (state: StateSchemaDashboardView) => void;
  setIsMounted: () => void;
  setErrors: (errors: Errors) => void;
  clearErrors: () => void;
  setDashboardViewItems: (data: SetDashboardViewItems) => void;
  setDashboardBunchesFromCache: (data: SetDashboardBunchesFromCache) => void;
  setEditMode: (data: SetEditMode) => void;
  setNewSelectedId: (id: ViewItemId) => void;
  setSelectedId: (id: ViewItemId) => void;
  setBright: (status: boolean) => void;
  setIsUnsaved: (status: boolean) => void;
  setActiveMovementId: () => void;
  clearActivatedMovementId: () => void;
  setActiveCopied: (data: ActivatedCopiedType) => void;
  clearActivatedCopied: () => void;
  updateViewItems: (data: PartialViewItem[]) => void;
  cancelUpdateViewItem: () => void;
  changeOneStyleField: (data: ChangeSelectedStyle) => void;
  setSelectedStyles: (data: ViewItemStyles) => void;
  changeOneSettingsField: (data: ChangeOneSettingsField) => void;
  changeOneChartsItem: (data: ChangeOneChartsItem) => void;
  changeOneDatasetsItem: (data: ChangeOneDatasetsItem) => void;

  // Асинхронные действия
  fetchBunches: (data: ReqGetBunches) => Promise<void>;
  createGroupViewItems: (data: { parentId: string; companyId: string; viewItem: Partial<ViewItem> }) => Promise<void>;
  saveUpdateViewItems: (data: UpdateViewItems) => Promise<void>;
  saveDeleteViewItem: (data: DeleteViews) => Promise<void>;
}

export type DashboardViewStore = StateSchemaDashboardView & DashboardViewActions;

// ============================================================
// Zustand-стор
// ============================================================
export const useDashboardViewStore = create<DashboardViewStore>((set, get) => ({
  ...createInitialState(),

  // ----------------------------------------------------------
  // Синхронные действия
  // ----------------------------------------------------------

  setInitial: (payload) =>
    set({
      entities: payload.entities || {},
      selectedId: payload.selectedId,
      bright: false,
      newStoredViewItem: payload.newStoredViewItem || undefined,
      prevStoredViewItem: payload.prevStoredViewItem || undefined,
      editMode: payload.editMode || false,
      loading: payload.loading,
      errors: payload.errors,
    }),

  setIsMounted: () => set({ _isMounted: true }),

  setErrors: (errors) => set({ errors: getError(errors) }),
  clearErrors: () => set({ errors: {} }),

  setDashboardViewItems: ({ viewItems }) =>
    set((state) => ({
      entities: updateEntities(state.entities, viewItems),
      activatedMovementId: '',
      activatedCopied: undefined,
      bright: false,
    })),

  setDashboardBunchesFromCache: ({ companyId, changedBunches }) =>
    set((state) => {
      const bunches = getBunchesWithoutChanges(changedBunches || [], LS.getBunches(companyId));

      // НЕ пишем отфильтрованный набор обратно в LS: это затирало «изменённые» bunch
      // (удаляло их из LS), что при рассинхроне с viewBunchesUpdated давало пустой дашборд.
      return {
        // Мержим с текущими entities, а НЕ заменяем: при повторном вызове
        // (напр. после смены auth) замена затирала уже загруженные с сервера
        // (изменённые) bunches — дашборд оставался пустым.
        entities: updateEntities(state.entities, getViewitemsFromBunches(bunches)),
        activatedMovementId: '',
        activatedCopied: undefined,
        bright: false,
      };
    }),

  setEditMode: ({ editMode, companyId }) =>
    set((state) => {
      LS.setEditMode(companyId || '', editMode);
      return {
        editMode,
        selectedId: !editMode ? '' : state.selectedId,
      };
    }),

  setNewSelectedId: (id) => set({ newSelectedId: id }),

  setSelectedId: (id) =>
    set((state) => ({
      selectedId: id,
      newSelectedId: '',
      bright: false,
      prevStoredViewItem: state.newStoredViewItem,
      newStoredViewItem: state.entities[id] || {},
    })),

  setBright: (status) => set({ bright: status }),

  setIsUnsaved: (status) => set({ isUnsaved: status }),

  setActiveMovementId: () =>
    set((state) => ({
      activatedMovementId: state.selectedId,
      activatedCopied: undefined,
      bright: false,
    })),

  clearActivatedMovementId: () =>
    set({
      activatedMovementId: '',
      activatedCopied: undefined,
      bright: false,
    }),

  setActiveCopied: (data) =>
    set({
      activatedMovementId: '',
      activatedCopied: { ...data },
      bright: false,
    }),

  clearActivatedCopied: () =>
    set({
      activatedMovementId: '',
      activatedCopied: undefined,
      bright: false,
    }),

  updateViewItems: (payload) =>
    set((state) => ({
      entities: updateEntities(state.entities, payload),
      activatedMovementId: '',
      activatedCopied: undefined,
      bright: false,
    })),

  cancelUpdateViewItem: () =>
    set((state) => {
      if (state.newStoredViewItem && state.newStoredViewItem.id) {
        return {
          entities: {
            ...state.entities,
            [state.selectedId]: { ...state.newStoredViewItem },
          },
        };
      }
      // Если была ошибка, то прошлое состояние сохранилось в prevStoredViewItem
      else if (isNotEmpty(state.errors) && isNotEmpty(state.prevStoredViewItem) && state.prevStoredViewItem?.id) {
        return {
          entities: {
            ...state.entities,
            [state.selectedId]: { ...state.prevStoredViewItem },
          },
          newStoredViewItem: { ...state.prevStoredViewItem },
        };
      } else {
        __devLog('slice.dashboardView', 'newStoredViewItem is undefined or invalid');
        return {};
      }
    }),

  changeOneStyleField: ({ field, value }) =>
    set((state) => {
      const selectedEntity = state.entities[state.selectedId];
      if (selectedEntity) {
        if (!selectedEntity.styles) {
          selectedEntity.styles = {};
        }
        (selectedEntity.styles as Record<string, string | number>)[field] = value;
        return {
          entities: { ...state.entities, [state.selectedId]: { ...selectedEntity } },
        };
      }
      return {};
    }),

  setSelectedStyles: (styles) =>
    set((state) => {
      if (state.entities[state.selectedId]) {
        return {
          entities: {
            ...state.entities,
            [state.selectedId]: {
              ...state.entities[state.selectedId],
              styles,
            },
          },
        };
      }
      return {};
    }),

  changeOneSettingsField: ({ field, value }) =>
    set((state) => {
      const { selectedId } = state;
      if (state.entities[selectedId]) {
        const entity = { ...state.entities[selectedId] };
        if (!entity.settings) entity.settings = {};
        (entity.settings as Record<string, unknown>)[field as string] = value;
        return {
          entities: { ...state.entities, [selectedId]: entity },
        };
      }
      return {};
    }),

  changeOneChartsItem: ({ field, index, value }) =>
    set((state) => {
      const { selectedId } = state;
      const selectedItem = state.entities[selectedId];
      if (selectedItem) {
        const entity = { ...selectedItem };
        if (!entity.settings) entity.settings = {};
        entity.settings.charts = updateChartsItem(selectedItem, index || 0, field as any, value);
        return {
          entities: { ...state.entities, [selectedId]: entity },
        };
      }
      return {};
    }),

  changeOneDatasetsItem: ({ field, index, value }) =>
    set((state) => {
      const { selectedId } = state;
      const selectedItem = state.entities[selectedId];
      const datasets = cloneObj(selectedItem?.settings?.charts?.[index || 0]?.datasets || {}) as any;
      (datasets as Record<string, unknown>)[field as string] = value;

      if (selectedItem) {
        const entity = { ...selectedItem };
        if (!entity.settings) entity.settings = {};
        entity.settings.charts = updateChartsItem(selectedItem, index || 0, 'datasets' as any, datasets);
        return {
          entities: { ...state.entities, [selectedId]: entity },
        };
      }
      return {};
    }),

  // ----------------------------------------------------------
  // Асинхронные действия
  // ----------------------------------------------------------

  fetchBunches: async (data) => {
    const { companyId, bunchIds, bunchesUpdated } = data;
    set({ loading: true, errors: {} });

    try {
      let bunches = {} as BunchesViewItem;
      let compId = '';

      if (cfg.IS_DEV) {
        compId = LS.getLastCompanyId() || '';
        bunches = LS.getBunches(compId);
      } else {
        // В реальном API: const response = await apiBase.post(...)
        // Для миграции пока заглушка
        compId = companyId;
        bunches = LS.getBunches(compId);
      }

      set((state) => {
        LS.setBunches(compId, {
          ...LS.getBunches(compId),
          ...bunches,
        });
        LS.setViewBunchesUpdated(compId, {
          ...LS.getViewBunchesUpdated(compId),
          ...bunchesUpdated,
        });

        return {
          entities: updateEntities(state.entities, getViewitemsFromBunches(bunches)),
          _isLoaded: true,
          activatedMovementId: '',
          activatedCopied: undefined,
          bright: false,
          isUnsaved: false,
          loading: false,
          errors: {},
        };
      });
    } catch (e: any) {
      set({
        errors: getError(e?.response?.data || { general: 'Error in fetchBunches' }),
        loading: false,
      });
    }
  },

  createGroupViewItems: async (data) => {
    set({ loading: true, errors: {} });

    try {
      const result = await createGroupViewItemsApi(data as any);
      // Примечание: createGroupViewItemsApi — это createAsyncThunk,
      // в реальном API вызов будет другим. Для миграции используем dispatch через getState
      // TODO: переписать API на прямые функции
      set({ loading: false });
    } catch (e: any) {
      set({
        errors: getError(e?.response?.data || { general: 'Error in createGroupViewItems' }),
        loading: false,
      });
    }
  },

  saveUpdateViewItems: async (data) => {
    set({ loading: true, errors: {} });

    try {
      // Реальный API-вызов: PATCH /dashboard/view/update
      await api.patch(API_PATHS.dashboard.view.update, data);

      // Восстанавливаем логику Redux extraReducer fulfilled
      const { viewItems, companyId, newStoredViewItem, bunchUpdatedMs } = data as UpdateViewItems;

      set((state) => {
        // Сохраняем в LS
        LS.setBunches(
          companyId,
          updateBunches(LS.getBunches(companyId), getBunchesFromViewItems(viewItems as ViewItem[])),
        );
        LS.setViewBunchesUpdated(companyId, {
          ...LS.getViewBunchesUpdated(companyId),
          ...getBunchesTimestamps((viewItems || []) as ViewItem[], bunchUpdatedMs || 0),
        });

        return {
          entities: updateEntities(state.entities, viewItems),
          newStoredViewItem:
            newStoredViewItem && state.newStoredViewItem
              ? (updateObject(state.newStoredViewItem as any, newStoredViewItem) as ViewItem)
              : state.newStoredViewItem,
          activatedMovementId: '',
          activatedCopied: undefined,
          bright: false,
          isUnsaved: false, // ← скрывает кнопку "Сохранить"
          loading: false,
          errors: {},
        };
      });
    } catch (e: any) {
      // rejected логика
      set({
        prevStoredViewItem: get().newStoredViewItem,
        newStoredViewItem: undefined,
        errors: getError(e?.response?.data || { general: 'Error in saveUpdateViewItems' }),
        loading: false,
      });
    }
  },

  saveDeleteViewItem: async (data) => {
    set({ loading: true, errors: {} });

    try {
      // Реальный API-вызов: POST /dashboard/view/delete
      await api.post(API_PATHS.dashboard.view.delete, data);

      // Восстанавливаем логику Redux extraReducer fulfilled
      const { companyId, viewItems, bunchUpdatedMs } = data as DeleteViews;

      set((state) => {
        // Удаляем сущности
        const newEntities = { ...state.entities };
        viewItems?.forEach((item) => delete newEntities[item.id]);

        // Сохраняем в LS
        LS.setBunches(companyId, getBunchesFromViewItems(Object.values(newEntities)));
        LS.setViewBunchesUpdated(companyId, {
          ...LS.getViewBunchesUpdated(companyId),
          ...getBunchesTimestamps((viewItems || []) as any[], bunchUpdatedMs || 0),
        });

        return {
          entities: newEntities,
          selectedId: '',
          newStoredViewItem: undefined,
          prevStoredViewItem: undefined,
          activatedMovementId: '',
          activatedCopied: undefined,
          bright: false,
          isUnsaved: false, // ← скрывает кнопку "Сохранить"
          loading: false,
          errors: {},
        };
      });
    } catch (e: any) {
      set({
        prevStoredViewItem: get().newStoredViewItem,
        errors: getError(e?.response?.data || { general: 'Error in saveDeleteViewItem' }),
        loading: false,
      });
    }
  },
}));
