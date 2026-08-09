// packages/frontend/src/entities/dashboard-templates/model/store.ts
// Zustand-стор для управления шаблонами дашборда (templates, bunches, selectedId)
// Мигрировано с Redux (slice/index.ts + extraReducers getBunchesUpdated, getTemplates, updateTemplate, deleteTemplate)

import { create } from 'zustand';
import { Errors } from 'shared/lib/validators';
import { getPayloadError as getError } from 'shared/lib/errors';
import type { StateSchemaDashboardTemplates } from './state-schema';
import type { ViewItem, ViewItemId } from 'entities/dashboard-view';
import type { Template } from './types';
import { updateEntities } from 'entities/base';
import type {
  DeleteTemplateReq,
  DeleteTemplateRes,
  UpdateTemplateReq,
  UpdateTemplateRes,
} from 'shared/api/features/dashboard-templates';
import { LS } from 'shared/lib/local-storage';
import type { BunchesUpdated } from 'shared/lib/structures/bunch';
import { findMainViewItemById, findTemplateBySelectedId, isThisTemplate as isThisTemplateFunc } from './utils';
import { getAllChildren } from 'shared/lib/structures/view-items';
import { getArrWithoutArr, mergeById } from 'shared/helpers/arrays';
import { API_PATHS, api } from 'shared/api';

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

// Объявляем тип до использования в селекторах
interface DashboardTemplatesActions {
  setInitial: (payload: StateSchemaDashboardTemplates) => void;
  setIsMounted: () => void;
  setErrors: (errors?: Errors) => void;
  clearErrors: () => void;
  setDashboardTemplatesFromCache: () => void;
  setOpened: (flag: boolean) => void;
  setSelectedId: (id: ViewItemId) => void;
  activateMainViewItem: () => void;
  deleteSelectedViewItem: () => void;
  cancelUpdateTemplate: () => void;
  serviceGetBunchesUpdated: () => Promise<void>;
  serviceGetTemplates: (data: { bunchIds: string[] }) => Promise<void>;
  serviceUpdateTemplate: (data: UpdateTemplateReq) => Promise<void>;
  serviceDeleteTemplate: (data: DeleteTemplateReq) => Promise<void>;
}

export type DashboardTemplatesStore = StateSchemaDashboardTemplates & DashboardTemplatesActions;

// Селекторы
export const selectModule = (state: DashboardTemplatesStore) => state;
export const selectLoading = (state: DashboardTemplatesStore) => state.loading;
export const selectErrors = (state: DashboardTemplatesStore) => state.errors;
export const selectIsMounted = (state: DashboardTemplatesStore) => state._isMounted;
export const selectBunchesUpdated = (state: DashboardTemplatesStore) => state.bunchesUpdated;
export const selectEntities = (state: DashboardTemplatesStore) => state.entities;
// ВАЖНО: Object.values() создаёт новый массив при каждом вызове.
// Zustand сравнивает снапшоты через Object.is — новый массив → бесконечный цикл.
// Поэтому используем стабильные селекторы, которые возвращают ссылку на entities,
// а хуки должны мемоизировать производные значения.
export const selectTemplates = (state: DashboardTemplatesStore) => state.entities;
export const selectOpened = (state: DashboardTemplatesStore) => state.opened;
export const selectSelectedId = (state: DashboardTemplatesStore) => state.selectedId;
export const selectStoredSelected = (state: DashboardTemplatesStore) => state.storedSelected;

export const selectSelectedViewItem = (state: DashboardTemplatesStore) =>
  findMainViewItemById(state.entities, state.selectedId);

export const selectSelectedTemplate = (state: DashboardTemplatesStore) =>
  findTemplateBySelectedId(state.entities, state.selectedId);

export const selectIsMainItem = (state: DashboardTemplatesStore): boolean => {
  const template = selectSelectedTemplate(state);
  const selected = selectSelectedViewItem(state);
  if (!template || !selected) return false;
  return selected.parentId === template.id;
};

export const selectIsUnsaved = (state: DashboardTemplatesStore): boolean => {
  const { entities, storedSelected } = state;
  if (!storedSelected) return false;
  const current = entities[storedSelected.id];
  if (!current) return false;
  return JSON.stringify(storedSelected) !== JSON.stringify(current);
};

export const useDashboardTemplatesStore = create<DashboardTemplatesStore>((set, get) => ({
  ...initialState,

  setInitial: (payload) => set(() => ({ ...payload })),

  setIsMounted: () => set({ _isMounted: true }),

  setErrors: (errors) => set({ errors: getError(errors) }),

  clearErrors: () => set({ errors: {} }),

  setDashboardTemplatesFromCache: () => {
    set({ entities: updateEntities({}, LS.getTemplates() || []) });
  },

  setOpened: (flag) => set({ opened: flag }),

  setSelectedId: (id) =>
    set((state) => {
      const isThisTemplate = isThisTemplateFunc(state.entities, state.selectedId, id);
      const result: Partial<StateSchemaDashboardTemplates> = { selectedId: id };

      if (!isThisTemplate) {
        result.storedSelected = findTemplateBySelectedId(state.entities, id);
      }

      return result;
    }),

  activateMainViewItem: () =>
    set((state) => ({
      selectedId: findMainViewItemById(state.entities, state.selectedId)?.id,
    })),

  deleteSelectedViewItem: () =>
    set((state) => {
      const { selectedId, entities } = state;
      const mainViewItem = findMainViewItemById(entities, selectedId);
      const templateId = mainViewItem?.parentId;

      if (!templateId) return {};

      const viewItems = Object.values(entities[templateId].viewItems);
      const children = getAllChildren(viewItems, selectedId);

      const newEntities = { ...entities };
      newEntities[templateId] = {
        ...newEntities[templateId],
        viewItems: getArrWithoutArr(viewItems, children).reduce(
          (acc, item) => {
            acc[item.id] = item;
            return acc;
          },
          {} as Record<string, ViewItem>,
        ),
      };

      return {
        selectedId: findMainViewItemById(newEntities, selectedId)?.id,
        entities: newEntities,
      };
    }),

  cancelUpdateTemplate: () =>
    set((state) => {
      if (!state.storedSelected?.id) return {};
      const newEntities = { ...state.entities };
      newEntities[state.storedSelected.id] = {
        ...state.storedSelected,
      };
      return { entities: newEntities };
    }),

  // Асинхронные действия
  serviceGetBunchesUpdated: async () => {
    set({ loading: true, errors: {} });
    try {
      const { data } = await api.get<BunchesUpdated>(API_PATHS.templates.getBunchesUpdated);
      set({
        bunchesUpdated: data,
        entities: updateEntities({}, LS.getTemplates()),
        loading: false,
        errors: {},
      });
    } catch (e: unknown) {
      const err = e as { response?: { data?: Errors } };
      set({
        errors: getError(err?.response?.data || { general: 'Error in serviceGetBunchesUpdated' }),
        loading: false,
      });
    }
  },

  serviceGetTemplates: async (bunchData) => {
    set({ loading: true, errors: {} });
    try {
      const { data } = await api.post<{ templates: Template[]; bunchesUpdated: BunchesUpdated }>(
        API_PATHS.templates.getTemplates,
        bunchData,
      );
      const { templates, bunchesUpdated } = data;

      const currentState = get();
      const entities = updateEntities(currentState.entities, templates);

      LS.setTemplates(mergeById(Object.values(entities), templates));
      LS.setTemplatesBunchesUpdated(bunchesUpdated);

      set({
        entities,
        loading: false,
        errors: {},
      });
    } catch (e: unknown) {
      const err = e as { response?: { data?: Errors } };
      set({
        errors: getError(err?.response?.data || { general: 'Error in serviceGetTemplates' }),
        loading: false,
      });
    }
  },

  serviceUpdateTemplate: async (payload) => {
    set({ loading: true, errors: {} });
    try {
      const { data } = await api.post<UpdateTemplateRes>(API_PATHS.templates.update, payload);
      const { template, bunchUpdatedMs, fullSet } = data;

      const currentState = get();
      const entities = updateEntities(currentState.entities, [template]);

      const result: Partial<StateSchemaDashboardTemplates> = {
        entities,
        loading: false,
        errors: {},
      };

      if (fullSet) {
        result.storedSelected = template as Template;
      }

      LS.setTemplates(Object.values(entities));
      LS.setTemplatesBunchesUpdated({
        ...LS.getTemplatesBunchesUpdated(),
        [template.bunchId || '1']: bunchUpdatedMs,
      });

      set(result);
    } catch (e: unknown) {
      const err = e as { response?: { data?: Errors } };
      set({
        errors: getError(err?.response?.data || { general: 'Error in serviceUpdateTemplate' }),
        loading: false,
      });
    }
  },

  serviceDeleteTemplate: async (payload) => {
    set({ loading: true, errors: {} });
    try {
      const { data } = await api.post<DeleteTemplateRes>(API_PATHS.templates.delete, payload);
      const { templateId, bunchUpdatedMs, bunchId } = data;

      const currentState = get();
      const entities = { ...currentState.entities };
      delete entities[templateId];

      LS.setTemplates(Object.values(entities));
      LS.setTemplatesBunchesUpdated({
        ...LS.getTemplatesBunchesUpdated(),
        [bunchId]: bunchUpdatedMs,
      });

      set({
        entities,
        selectedId: undefined,
        storedSelected: undefined,
        loading: false,
        errors: {},
      });
    } catch (e: unknown) {
      const err = e as { response?: { data?: Errors } };
      set({
        errors: getError(err?.response?.data || { general: 'Error in serviceDeleteTemplate' }),
        loading: false,
      });
    }
  },
}));
