import { FC, memo, useCallback, useState } from 'react';
import DrawerStyled from './styled';
import { ConfiguratorMainHeader as MainHeader } from 'shared/ui/configurators-components';
import { useDashboardViewActions } from 'entities/dashboard-view';
import Box from '@mui/material/Box';
import { useCompany } from 'entities/company'
import { UnsavedChanges } from '../unsaved-changes';
import { InfoBlock } from '../info-block';
import { PaletteModeSwitcher } from 'features/ui';
import { Unselected } from '../unselected';
import { useUI } from 'entities/ui';
import { f } from 'shared/styles';
import { ViewItemConfiguratorTabs } from '../tabs';
import { ClearLsBunchesUpdated } from 'features/dashboard-view/ui/configurator';
import { isNotEmpty } from 'shared/helpers/objects';



const ViewItemConfigurator: FC = memo(() => {
  const { paramsCompanyId, paramsChangedCompany, cancelParamsCustomSettings } = useCompany();
  const { setWarningMessage } = useUI();
  const {
    errors, editMode, selectedId, selectedItem, isUnsaved, changedViewItem,
    setSelectedId, setEditMode, cancelUpdateViewItem
  } = useDashboardViewActions();
  const [value, setValue] = useState('1');


  /** Закрываем конфигуратор */
  const handleClose = useCallback(() => {
    // Если есть ошибки значит пошло что-то не так (разлогинился например)
    if (isUnsaved && isNotEmpty(errors)) {
      if (isNotEmpty(paramsChangedCompany)) cancelParamsCustomSettings(); /** Отменить изменившиеся customSettings */
      if (isNotEmpty(changedViewItem)) cancelUpdateViewItem(); /** Отменить изменившиеся поля | стили */
    }
    else if (isUnsaved) {
      return setWarningMessage('Cохраните изменения');
      // TODO: autoclick to saveBtn
      // const element = document.getElementById('saveBtn');
      // if (element) {
      //   element.click();
      // }
    }
    setValue('1');
    setEditMode({ editMode: false, companyId: paramsCompanyId });
    setSelectedId(''); // Убираем, чтобы prevStoredViewItem обновился и произошло сохранение
  },
    [
      errors, paramsCompanyId, isUnsaved, paramsChangedCompany, changedViewItem,
      setValue, setEditMode, setSelectedId, setWarningMessage, cancelParamsCustomSettings, cancelUpdateViewItem,
    ]
  );


  return (
    // @ts-ignore
    <DrawerStyled anchor='right' variant='permanent' ownerState={{ editMode }}>
      <Box sx={{ ...f('c'), position: 'relative', height: '100%', color: 'text.main', overflowY: 'auto' }}>
        <MainHeader view onClose={handleClose} />
        <UnsavedChanges />
        {! selectedId && <Unselected />}
        {selectedId && <>
          <InfoBlock />

          <ViewItemConfiguratorTabs
            value        = {value}
            selectedItem = {selectedItem}
            onSetValue   = {setValue}
          />
        </>}
      </Box>

      <Box sx={{ ...f('-c-fe'), gap: 2, mt: 2 }}>
        <ClearLsBunchesUpdated />
        <PaletteModeSwitcher />
      </Box>
    </DrawerStyled>
  )
});


export default ViewItemConfigurator;
