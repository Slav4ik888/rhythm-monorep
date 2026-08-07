import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LS } from 'shared/lib/local-storage';
import { Errors } from 'shared/lib/validators';
import { getPayloadError as getError } from 'shared/lib/errors';
import { ActivatedCopied, StateSchemaDashboardView } from './state-schema';
import {
  SetDashboardViewItems, ChangeSelectedStyle, ChangeOneSettingsField, ChangeOneDatasetsItem,
  ChangeOneChartsItem, SetEditMode, SetDashboardBunchesFromCache, SetDashboardBunches
} from './types';
import { updateEntities } from 'entities/base';
import {
  ViewItemId, ViewItemSettings, ViewItemStyles, PartialViewItem, ViewItem, ViewItemStylesField
} from '../../types';
import { cloneObj, isNotEmpty, updateObject } from 'shared/helpers/objects';
import {
  getBunchesFromViewItems, getBunchesTimestamps, getBunchesWithoutChanges, getViewitemsFromBunches,
  updateBunches, updateChartsItem
} from '../utils';
import { ChartConfigDatasets } from 'entities/charts';
import { __devLog } from 'shared/lib/tests/__dev-log';
import {
  CreateGroupViewItems, createGroupViewItems, deleteViewItem, DeleteViews,
  UpdateViewItems, updateViewItems
} from 'shared/api/features/dashboard-view';
import { getBunches } from '../services';



const initialState: StateSchemaDashboardView = {
  loading               : false,
  errors                : {},
  _isMounted            : false,
  _isLoaded             : false, // Загружены ViewItems

  editMode              : false,
  entities              : {},

  newSelectedId         : '',
  selectedId            : '',
  bright                : false,
  isUnsaved             : false, // Наличие не сохраненных изменений (в тч customSettings in Company)

  newStoredViewItem     : undefined, // Начальные значения выбранного элемента
  prevStoredViewItem    : undefined, // Начальные значения предыдущего выбранного элемента || в случае ошибки, сюда сохраняется newStoredViewItem

  activatedMovementId   : '',        // Активированный Id перемещаемого элемента
  activatedCopied       : undefined, // Активированный Id копируемого элемента
};


export const slice = createSlice({
  name: 'entities/dashboardView',
  initialState,
  reducers: {
    setInitial: (state, { payload }: PayloadAction<StateSchemaDashboardView>) => {
      state.entities           = payload.entities           || {};
      state.selectedId         = payload.selectedId;
      state.bright             = false;
      state.newStoredViewItem  = payload.newStoredViewItem  || undefined;
      state.prevStoredViewItem = payload.prevStoredViewItem || undefined;
      state.editMode           = payload.editMode           || false;
      state.loading            = payload.loading;
      state.errors             = payload.errors;
    },
    // Только для того, чтобы дождаться отрисовки графиков
    setIsMounted: (state) => {
      state._isMounted = true;
    },
    setErrors: (state, { payload }: PayloadAction<Errors>) => {
      state.errors = getError(payload);
    },
    clearErrors: (state) => {
      state.errors = {};
    },

    // При activatedCopied вначале сохраняем сюда, а затем в БД
    setDashboardViewItems: (state, { payload }: PayloadAction<SetDashboardViewItems>) => {
      state.entities            = updateEntities(state.entities, payload.viewItems);
      state.activatedMovementId = '';
      state.activatedCopied     = undefined;
      state.bright              = false;
    },

    // Берём закэшированную версию
    setDashboardBunchesFromCache: (state, { payload }: PayloadAction<SetDashboardBunchesFromCache>) => {
      const { companyId, changedBunches } = payload;
      const bunches = getBunchesWithoutChanges(changedBunches, LS.getBunches(companyId));

      state.entities            = updateEntities({}, getViewitemsFromBunches(bunches));
      state.activatedMovementId = '';
      state.activatedCopied     = undefined;
      state.bright              = false;

      // Обновляем в LS так как возможно изменились bunches
      LS.setBunches(companyId, { ...bunches });
    },

    setEditMode: (state, { payload }: PayloadAction<SetEditMode>) => {
      const { editMode, companyId } = payload;
      state.editMode = editMode;
      LS.setEditMode(companyId, editMode);

      if (! editMode) {
        state.selectedId = '';
      }
    },

    /** Вначале newSelectedId а затем по условию из useEffect */
    setNewSelectedId: (state, { payload }: PayloadAction<ViewItemId>) => {
      state.newSelectedId = payload;
    },

    /**
     * Запускается из useEffect
     * Id выбранного элемента (при editMode === true)
     */
    setSelectedId: (state, { payload }: PayloadAction<ViewItemId>) => {
      state.selectedId         = payload;
      state.newSelectedId      = '';
      state.bright             = false;
      state.prevStoredViewItem = state.newStoredViewItem;
      state.newStoredViewItem  = state.entities[payload] || {};
    },

    /** Подсветка выбранного элемента (selectedId) */
    setBright:  (state, { payload }: PayloadAction<boolean>) => {
      state.bright = payload;
    },

    /** Наличие не сохраненных изменений (в тч customSettings in Company) */
    setIsUnsaved: (state, { payload }: PayloadAction<boolean>) => {
      state.isUnsaved = payload;
    },

    // Перемещение выбранного View-item в другой
    setActiveMovementId: (state) => {
      state.activatedMovementId = state.selectedId;
      state.activatedCopied     = undefined;
      state.bright              = false;
    },
    clearActivatedMovementId: (state) => {
      state.activatedMovementId = '';
      state.activatedCopied     = undefined;
      state.bright              = false;
    },

    // Копирование выбранного View-item в другой
    setActiveCopied: (state, { payload }: PayloadAction<ActivatedCopied>) => {
      state.activatedMovementId = '';
      state.activatedCopied     = { ...payload };
      state.bright              = false;
    },
    clearActivatedCopied: (state) => {
      state.activatedMovementId = '';
      state.activatedCopied     = undefined;
      state.bright              = false;
    },

    // Update View-item
    updateViewItems: (state, { payload }: PayloadAction<PartialViewItem[]>) => {
      state.entities            = updateEntities(state.entities, payload);
      state.activatedMovementId = '';
      state.activatedCopied     = undefined;
      state.bright              = false;
    },

    cancelUpdateViewItem: (state) => {
      if (state.newStoredViewItem && state.newStoredViewItem.id) {
        state.entities[state.selectedId] = { ...state.newStoredViewItem };
      }
      // Если была ошибка, то прошлое состояние сохранилось в prevStoredViewItem
      else if (isNotEmpty(state.errors) && isNotEmpty(state.prevStoredViewItem) && state.prevStoredViewItem?.id) {
        state.entities[state.selectedId] = { ...state.prevStoredViewItem };
        state.newStoredViewItem = { ...state.prevStoredViewItem };
      }
      else {
        // Optionally handle missing data, e.g., throw error or log warning
        __devLog('slice.dashboardView', 'newStoredViewItem is undefined or invalid');
      }
    },

    // Изменение 1 field в styles
    changeOneStyleField: (state, { payload }: PayloadAction<ChangeSelectedStyle>) => {
      const { field, value, funcName } = payload;
      __devLog('slice.dashboardView', 'changeOneStyleField: [funcName]', funcName);

      const selectedEntity = state.entities[state.selectedId];
      if (selectedEntity) {
        if (! selectedEntity.styles) {
          selectedEntity.styles = {};
        }
        (selectedEntity.styles as Record<ViewItemStylesField, string | number>)[field] = value;
      }
    },

    setSelectedStyles: (state, { payload }: PayloadAction<ViewItemStyles>) => {
      state.entities[state.selectedId].styles = payload;
    },

    // Изменение 1 field в settings
    changeOneSettingsField: (state, { payload }: PayloadAction<ChangeOneSettingsField>) => {
      const { field, value } = payload;
      const { selectedId } = state;

      if (state.entities[selectedId]) {
        if (! state.entities[selectedId]?.settings) state.entities[selectedId].settings = {};
        (state.entities[selectedId].settings as ViewItemSettings)[field] = value;
      }
    },

    // Изменение 1 field в settings.charts[index]
    changeOneChartsItem: (state, { payload }: PayloadAction<ChangeOneChartsItem>) => {
      const { field, index, value } = payload;
      const { selectedId } = state;
      const selectedItem = state.entities[selectedId];

      if (state.entities[selectedId]) {
        if (! state.entities[selectedId]?.settings) state.entities[selectedId].settings = {};
        (state.entities[selectedId].settings as ViewItemSettings).charts = updateChartsItem(
          selectedItem,
          index,
          field,
          value
        );
      }
    },

    // Изменение 1 field в settings.charts[index].datasets
    changeOneDatasetsItem: (state, { payload }: PayloadAction<ChangeOneDatasetsItem>) => {
      const { field, index, value } = payload;
      const { selectedId } = state;
      const selectedItem = state.entities[selectedId];
      const datasets     = cloneObj(selectedItem?.settings?.charts?.[index]?.datasets || {}) as ChartConfigDatasets;
      datasets[field] = value as never;

      if (state.entities[selectedId]) {
        if (! state.entities[selectedId]?.settings) state.entities[selectedId].settings = {};
        (state.entities[selectedId].settings as ViewItemSettings).charts = updateChartsItem(
          selectedItem,
          index,
          'datasets',
          datasets
        );
      }
    },

  },


  extraReducers: builder => {
    // GET-BUNCHES
    builder
      .addCase(getBunches.pending, (state) => {
        state.loading = true;
        state.errors  = {};
      })
      .addCase(getBunches.fulfilled, (state, { payload }: PayloadAction<SetDashboardBunches>) => {
        const { companyId, bunches, bunchesUpdated } = payload;

        // Нужно чтобы возможные данные из LS НЕ перезатёрлись новыми
        state.entities            = updateEntities(state.entities, getViewitemsFromBunches(bunches));
        state._isLoaded           = true;
        state.activatedMovementId = '';
        state.activatedCopied     = undefined;
        state.bright              = false;
        state.isUnsaved           = false;
        state.loading             = false;
        state.errors              = {};

        LS.setBunches(companyId, {
          ...LS.getBunches(companyId),
          ...bunches
        });
        LS.setViewBunchesUpdated(companyId, {
          ...LS.getViewBunchesUpdated(companyId),
          ...bunchesUpdated
        });
      })
      .addCase(getBunches.rejected, (state, { payload }) => {
        state.errors  = getError(payload);
        state.loading = false;
      })


    // ADD-GROUP-NEW-ITEMS
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    builder
      .addCase(createGroupViewItems.pending, (state) => {
        state.loading = true;
        state.errors  = {};
      })
      .addCase(createGroupViewItems.fulfilled, (state, { payload }: PayloadAction<CreateGroupViewItems>) => {
        const { viewItems, companyId, bunchUpdatedMs } = payload;

        state.entities            = updateEntities(state.entities, viewItems);
        state.activatedMovementId = '';
        state.activatedCopied     = undefined;
        state.bright              = false;
        state.loading             = false;
        state.errors              = {};

        LS.setBunches(companyId, updateBunches(
          LS.getBunches(companyId), getBunchesFromViewItems(viewItems)
        ));
        LS.setViewBunchesUpdated(companyId, {
          ...LS.getViewBunchesUpdated(companyId),
          ...getBunchesTimestamps(viewItems, bunchUpdatedMs)
        });
      })
      .addCase(createGroupViewItems.rejected, (state, { payload }) => {
        state.errors  = getError(payload);
        state.loading = false;
      })

    // UPDATE-VIEW-ITEMS []
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    builder
      .addCase(updateViewItems.pending, (state) => {
        state.loading = true;
        state.errors  = {};
      })
      .addCase(updateViewItems.fulfilled, (state, { payload }: PayloadAction<UpdateViewItems>) => {
        const { viewItems, companyId, newStoredViewItem, bunchUpdatedMs } = payload;

        if (newStoredViewItem) {
          state.newStoredViewItem = updateObject(state.newStoredViewItem, newStoredViewItem);
        }

        state.entities            = updateEntities(state.entities, viewItems);
        state.activatedMovementId = '';
        state.activatedCopied     = undefined;
        state.bright              = false;
        state.isUnsaved           = false;
        state.loading             = false;
        state.errors              = {};

        // Save to LS
        LS.setBunches(companyId, updateBunches(
          LS.getBunches(companyId), getBunchesFromViewItems(viewItems as ViewItem[])
        ));
        LS.setViewBunchesUpdated(companyId, {
          ...LS.getViewBunchesUpdated(companyId),
          ...getBunchesTimestamps(viewItems, bunchUpdatedMs)
        });
      })
      .addCase(updateViewItems.rejected, (state, { payload }) => {
        state.prevStoredViewItem = state.newStoredViewItem; // Сохраняем начальное состояние, чтобы сработала кнопка "Отменить"
        state.newStoredViewItem = undefined; // Раз обновление завершилось с ошибкой, то нельзя переключаться на новый элемент
        state.errors  = getError(payload);
        state.loading = false;
      })

    // DELETE-VIEW
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    builder
      .addCase(deleteViewItem.pending, (state) => {
        state.loading = true;
        state.errors  = {};
      })
      .addCase(deleteViewItem.fulfilled, (state, { payload }: PayloadAction<DeleteViews>) => {
        const { companyId, viewItems, bunchUpdatedMs } = payload;

        viewItems.forEach(item => delete state.entities[item.id]);

        state.selectedId          = '';
        state.newStoredViewItem   = undefined;
        state.prevStoredViewItem  = undefined;
        state.activatedMovementId = '';
        state.activatedCopied     = undefined;
        state.bright              = false;
        state.isUnsaved           = false;
        state.loading             = false;
        state.errors              = {};

        // Save to LS
        LS.setBunches(companyId, getBunchesFromViewItems(Object.values(state.entities)));
        LS.setViewBunchesUpdated(companyId, {
          ...LS.getViewBunchesUpdated(companyId),
          ...getBunchesTimestamps(viewItems, bunchUpdatedMs)
        });
      })
      .addCase(deleteViewItem.rejected, (state, { payload }) => {
        state.errors  = getError(payload);
        state.prevStoredViewItem = state.newStoredViewItem; // Чтобы можно было откатиться (но не проверял)
        state.loading = false;
      })
  }
})

export const { actions, reducer } = slice;
