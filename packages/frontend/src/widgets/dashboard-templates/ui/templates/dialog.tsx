import { FC, memo, useCallback, useEffect } from 'react';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { DialogInfo } from 'shared/ui/dialogs';
import { UseBase } from 'shared/lib/hooks';
import { TemplatesConfigurator } from '../configurator';
import { TemplatesContainer } from '../templates-container';
import { f } from 'shared/styles';
import { LS } from 'shared/lib/local-storage';
import { getInitialState as getInitialStateTemplates, useDashboardTemplates } from 'entities/dashboard-templates';
import { getBunchesToUpdate } from 'entities/dashboard-view';



interface Props {
  hookOpen: UseBase
}

/** Открытое окно с шаблонами */
const TemplatesDialog: FC<Props> = memo(({ hookOpen }) => {
  const {
    bunchesUpdated, setInitial, setOpened, serviceGetTemplates
  } = useDashboardTemplates();


  useEffect(() => {
    // Templates
    if (bunchesUpdated) { // Запускаем после получения данных из DB
      const bunchesForLoad = getBunchesToUpdate(bunchesUpdated, LS.getTemplatesBunchesUpdated());

      if (bunchesForLoad.length) {
        __devLog('TemplatesDialog', 'Template bunches for load:', bunchesForLoad.length);
        __devLog('TemplatesDialog', bunchesForLoad);
        serviceGetTemplates({
          bunchIds: bunchesForLoad,
        });
      }
      else {
        __devLog('TemplatesDialog', 'All template bunches from cache');
      }
    }
  },
    [bunchesUpdated, serviceGetTemplates]
  );


  useEffect(() => {
    setInitial(getInitialStateTemplates());
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );



  const handleClose = useCallback(() => {
    hookOpen.setOpen(false);
    setOpened(false);
  },
    [hookOpen, setOpened]
  );


  return (
    <DialogInfo
      title    = 'Шаблоны'
      maxWidth = {false}
      hookOpen = {hookOpen}
      onClose  = {handleClose}
      sx       = {{ content: { ...f(), minHeight: 'calc(100vh - 126px)', p: 2 } }}
    >
      <TemplatesContainer />

      <TemplatesConfigurator />
    </DialogInfo>
  )
});

export default TemplatesDialog;
