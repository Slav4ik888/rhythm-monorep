import { ActivatedCopied, StateSchemaDashboardView } from '../../slice/state-schema';
import {
  SetDashboardViewItems, SetEditMode,
  ChangeOneChartsItem, ChangeOneDatasetsItem, ChangeOneSettingsField, ChangeSelectedStyle, SetDashboardBunchesFromCache
} from '../../slice/types';
import { useMemo } from 'react';
import { useAppDispatch } from 'shared/lib/hooks';
import { Errors } from 'shared/lib/validators';
import { PartialViewItem, ViewItemId, ViewItemStyles } from '../../../types';
import { useDashboardViewState } from '../use-dashboard-view-state';
import { actions } from '../../slice';



interface Config {
  parentId? : ViewItemId
}

export const useDashboardViewActions = (config: Config = {}) => {
  const { parentId } = config;
  const dispatch = useAppDispatch();

  const state = useDashboardViewState({ parentId });

  const api = useMemo(() => ({
    // Методы работы с состоянием
    setErrors                    : (errors: Errors) => dispatch(actions.setErrors(errors)),
    clearErrors                  : () => dispatch(actions.setErrors({})),
    setInitial                   : (state: StateSchemaDashboardView) => dispatch(actions.setInitial(state)),
    setIsMounted                 : () => dispatch(actions.setIsMounted()),
    setDashboardViewItems        : (data: SetDashboardViewItems) => dispatch(actions.setDashboardViewItems(data)),
    setEditMode                  : (data: SetEditMode) => dispatch(actions.setEditMode(data)),
    updateViewItems              : (data: PartialViewItem[]) => dispatch(actions.updateViewItems(data)),
    cancelUpdateViewItem         : () => dispatch(actions.cancelUpdateViewItem()),

    // Movement
    setActiveMovementId          : () => dispatch(actions.setActiveMovementId()),
    clearActivatedMovementId     : () => dispatch(actions.clearActivatedMovementId()),

    // Copying
    setActiveCopied              : (data: ActivatedCopied) => dispatch(actions.setActiveCopied(data)),
    clearActivatedCopied         : () => dispatch(actions.clearActivatedCopied()),
    // View
    setNewSelectedId             : (id: ViewItemId) => dispatch(actions.setNewSelectedId(id)),
    setSelectedId                : (id: ViewItemId) => dispatch(actions.setSelectedId(id)),
    setBright                    : (status: boolean) => dispatch(actions.setBright(status)),

    setIsUnsaved                 : (status: boolean) => dispatch(actions.setIsUnsaved(status)),
    // Styles
    changeOneStyleField          : (data: ChangeSelectedStyle) => dispatch(actions.changeOneStyleField(data)),
    setSelectedStyles            : (data: ViewItemStyles) => dispatch(actions.setSelectedStyles(data)),

    // Settings
    changeOneSettingsField       : (data: ChangeOneSettingsField) => dispatch(actions.changeOneSettingsField(data)),
    changeOneChartsItem          : (data: ChangeOneChartsItem)    => dispatch(actions.changeOneChartsItem(data)),
    // Изменение 1 field в settings.charts[index].datasets
    changeOneDatasetsItem        : (data: ChangeOneDatasetsItem)  => dispatch(actions.changeOneDatasetsItem(data)),

    setDashboardBunchesFromCache: (data: SetDashboardBunchesFromCache) => dispatch(
      actions.setDashboardBunchesFromCache(data)
    ),
  }),
    [dispatch]
  );


  return {
    ...state,
    ...api
  }
};
