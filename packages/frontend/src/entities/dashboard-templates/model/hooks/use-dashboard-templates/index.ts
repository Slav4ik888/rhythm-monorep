import { useMemo } from 'react';
import * as s from '../../selectors';
import { actions as a } from '../../slice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/lib/hooks';
import { Errors } from 'shared/lib/validators';
import { StateSchemaDashboardTemplates } from '../../slice/state-schema';
import { ViewItemId } from 'entities/dashboard-view';
import { getBunchesUpdated, getTemplates } from '../../services';
import {
  deleteTemplate, DeleteTemplate, updateTemplate, UpdateTemplate
 } from 'shared/api/features/dashboard-templates';
import { ReqGetTemplates } from '../../services/get-templates';



export const useDashboardTemplates = () => {
  const dispatch = useAppDispatch();

  const loading          = useSelector(s.selectLoading);
  const errors           = useSelector(s.selectErrors);
  const isMounted        = useSelector(s.selectIsMounted);
  const bunchesUpdated   = useSelector(s.selectBunchesUpdated);
  const entities         = useSelector(s.selectEntities);
  const templates        = useSelector(s.selectTemplates);

  const opened           = useSelector(s.selectOpened);
  const selectedId       = useSelector(s.selectSelectedId);
  const selectedTemplate = useSelector(s.selectSelectedTemplate);
  const selectedViewItem = useSelector(s.selectSelectedViewItem);
  const isMainItem       = useSelector(s.selectIsMainItem);
  const storedSelected   = useSelector(s.selectStoredSelected);
  const isUnsaved        = useSelector(s.selectIsUnsaved);


  const api = useMemo(() => ({
    setErrors                : (errors: Errors) => dispatch(a.setErrors(errors)),
    clearErrors              : () => dispatch(a.setErrors({})),

    setInitial               : (state: StateSchemaDashboardTemplates) => dispatch(a.setInitial(state)),
    setIsMounted             : () => dispatch(a.setIsMounted()),
    setOpened                : (flag: boolean) => dispatch(a.setOpened(flag)),
    setSelectedId            : (id: ViewItemId) => dispatch(a.setSelectedId(id)),
    activateMainViewItem     : () => dispatch(a.activateMainViewItem()),
    deleteSelectedViewItem   : () => dispatch(a.deleteSelectedViewItem()),
    cancelUpdateTemplate     : () => dispatch(a.cancelUpdateTemplate()),

    serviceGetBunchesUpdated : () => dispatch(getBunchesUpdated()),
    serviceGetTemplates      : (data: ReqGetTemplates) => dispatch(getTemplates(data)),
    serviceUpdateTemplate    : (data: UpdateTemplate) => dispatch(updateTemplate(data)),
    serviceDeleteTemplate    : (data: DeleteTemplate) => dispatch(deleteTemplate(data)),
  }),
    [dispatch]
  );


  return {
    loading,
    errors,
    isMounted,
    bunchesUpdated,

    entities,
    templates,

    opened,
    selectedId,
    storedSelected,
    selectedTemplate,
    selectedViewItem,
    isMainItem,
    isUnsaved,

    ...api
  }
};
