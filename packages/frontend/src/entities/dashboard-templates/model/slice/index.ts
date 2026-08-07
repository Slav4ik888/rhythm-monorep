import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Errors } from 'shared/lib/validators';
import { getPayloadError as getError } from 'shared/lib/errors';
import { StateSchemaDashboardTemplates } from './state-schema';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { ViewItem, ViewItemId } from 'entities/dashboard-view';
import { ResGetTemplates, getTemplates } from '../services';
import { updateEntities } from 'entities/base';
import {
  deleteTemplate, DeleteTemplate, UpdateTemplate, updateTemplate
} from 'shared/api/features/dashboard-templates';
import { LS } from 'shared/lib/local-storage';
import { BunchesUpdated } from 'shared/lib/structures/bunch';
import { getBunchesUpdated } from '../services/get-bunches-updated';
import { getArrWithoutArr, mergeById } from 'shared/helpers/arrays';
import { findMainViewItemById, findTemplateBySelectedId, isThisTemplate as isThisTemplateFunc } from '../utils';
import { getAllChildren } from 'shared/lib/structures/view-items';
import { Template } from '../types';



const initialState: StateSchemaDashboardTemplates = {
  loading        : false,
  errors         : {},
  _isMounted     : false,
  bunchesUpdated : undefined,
  entities       : {},
  opened         : false,
  selectedId     : undefined,
  storedSelected : undefined,
};


export const slice = createSlice({
  name: 'entities/dashboardTemplates',
  initialState,
  reducers: {
    setInitial: (state, { payload }: PayloadAction<StateSchemaDashboardTemplates>) => {
      state.entities   = payload.entities || {};
      state.selectedId = payload.selectedId;
      state.loading    = payload.loading;
      state.errors     = payload.errors;
    },
    setIsMounted: (state) => {
      state._isMounted = true;
    },
    setErrors: (state, { payload }: PayloadAction<Errors>) => {
      state.errors = getError(payload);
    },
    clearErrors: (state) => {
      state.errors = {};
    },
    setDashboardTemplatesFromCache: (state) => {
      state.entities = updateEntities({}, LS.getTemplates());
    },
    setOpened: (state, { payload }: PayloadAction<boolean>) => {
      state.opened = payload;
    },
    setSelectedId: (state, { payload }: PayloadAction<ViewItemId>) => {
      const isThisTemplate = isThisTemplateFunc(state.entities, state.selectedId, payload);
      state.selectedId = payload;

      // Обновляем storedSelected только если изменился Template
      if (! isThisTemplate) {
        state.storedSelected = findTemplateBySelectedId(state.entities, payload)
      }
    },
    activateMainViewItem:  (state) => {
      state.selectedId = findMainViewItemById(state.entities, state.selectedId)?.id;
    },
    deleteSelectedViewItem: (state) => {
      const { selectedId } = state;
      const mainViewItem = findMainViewItemById(state.entities, selectedId);
      const templateId = mainViewItem?.parentId;

      if (templateId) {
        const viewItems = Object.values(state.entities[templateId].viewItems);
        const children = getAllChildren(viewItems, selectedId);

        state.selectedId = findMainViewItemById(state.entities, selectedId)?.id;

        state.entities[templateId] = {
          ...state.entities[templateId],
          viewItems: getArrWithoutArr(viewItems, children).reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
          }, {} as Record<string, ViewItem>),
        };
      }
    },
    cancelUpdateTemplate: (state) => {
      if (state.storedSelected?.id) {
        state.entities[state.storedSelected.id] = {
          ...state.storedSelected
        };
      }
    }
  },


  extraReducers: builder => {
    // GET-BUNCHES-UPDATED []
    builder
      .addCase(getBunchesUpdated.pending, (state) => {
        state.loading = true;
        state.errors  = {};
      })
      .addCase(getBunchesUpdated.fulfilled, (state, { payload }: PayloadAction<BunchesUpdated>) => {
        state.bunchesUpdated = payload;
        state.entities       = updateEntities({}, LS.getTemplates()); // Загружаем Templates из кеша
        state.loading        = false;
        state.errors         = {};
      })
      .addCase(getBunchesUpdated.rejected, (state, { payload }) => {
        state.errors  = getError(payload);
        state.loading = false;
      })
    // GET-BUNCHES []
    builder
      .addCase(getTemplates.pending, (state) => {
        state.loading = true;
        state.errors  = {};
      })
      .addCase(getTemplates.fulfilled, (state, { payload }: PayloadAction<ResGetTemplates>) => {
        const { templates, bunchesUpdated } = payload;

        state.entities = updateEntities(state.entities, templates);
        state.loading  = false;
        state.errors   = {};

        LS.setTemplates(mergeById(Object.values(state.entities), templates));
        LS.setTemplatesBunchesUpdated(bunchesUpdated); // С сервера приходит весь актуальный объект
      })
      .addCase(getTemplates.rejected, (state, { payload }) => {
        state.errors  = getError(payload);
        state.loading = false;
      })
    // UPDATE TEMPLATE
    builder
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
        state.errors  = {};
      })
      .addCase(updateTemplate.fulfilled, (state, { payload }: PayloadAction<UpdateTemplate>) => {
        const { template, bunchUpdatedMs, fullSet } = payload;

        if (fullSet) {
          state.storedSelected = template as Template;
        }

        state.entities = updateEntities(state.entities, [template]);
        state.loading  = false;
        state.errors   = {};

        LS.setTemplates(Object.values(state.entities));
        LS.setTemplatesBunchesUpdated({
          ...LS.getTemplatesBunchesUpdated(),
          [template.bunchId || '1']: bunchUpdatedMs
        });
      })
      .addCase(updateTemplate.rejected, (state, { payload }) => {
        state.errors  = getError(payload);
        state.loading = false;
      })
    // DELETE TEMPLATE
    builder
      .addCase(deleteTemplate.pending, (state) => {
        state.loading = true;
        state.errors  = {};
      })
      .addCase(deleteTemplate.fulfilled, (state, { payload }: PayloadAction<DeleteTemplate>) => {
        const { templateId, bunchUpdatedMs, bunchId } = payload;

        delete state.entities[templateId];

        state.selectedId     = undefined;
        state.storedSelected = undefined;
        state.loading        = false;
        state.errors         = {};

        LS.setTemplates(Object.values(state.entities));
        LS.setTemplatesBunchesUpdated({
          ...LS.getTemplatesBunchesUpdated(),
          [bunchId]: bunchUpdatedMs
        });
      })
      .addCase(deleteTemplate.rejected, (state, { payload }) => {
        state.errors  = getError(payload);
        state.loading = false;
      })
  }
})

export const { actions, reducer } = slice;
