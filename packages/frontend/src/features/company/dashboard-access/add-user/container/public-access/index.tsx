import { FC, useState, useCallback, useEffect } from 'react';
import { Tooltip } from 'shared/ui/tooltip';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useCompany } from 'entities/company';
import { usePages } from 'shared/lib/hooks';
import { pxToRem } from 'shared/styles';
import { NO_SHEET_ID } from 'entities/dashboard-view';



/** Управление публичным доступом к текущей dashboardSheetId */
export const PublicAccess: FC = () => {
  const { paramsCompany, serviceUpdateCompany } = useCompany();
  const { dashboardSheetId = NO_SHEET_ID } = usePages();

  const [checked, setChecked] = useState<boolean>(Boolean(paramsCompany?.dashboardPublicAccess?.[dashboardSheetId]));

  useEffect(() => {
    setChecked(Boolean(paramsCompany?.dashboardPublicAccess?.[dashboardSheetId]));
  }, [dashboardSheetId, paramsCompany]);


  const handleToggle = useCallback(() => {
    // TODO: checkAccess к данной операции

    if (! dashboardSheetId) return

    serviceUpdateCompany({
      id                    : paramsCompany.id,
      dashboardPublicAccess : {
        [dashboardSheetId]: ! paramsCompany?.dashboardPublicAccess?.[dashboardSheetId]
      }
    })
  }, [paramsCompany, dashboardSheetId, serviceUpdateCompany]);


  return (
    <Tooltip title='Открыть публичный доступ к просмотру текущей страницы'>
      <FormControlLabel
        label          = {`${checked ? 'П' : 'Открыть п'}убличный доступ к просмотру`}
        labelPlacement = 'end'
        control        = {
          <Switch
            color   = 'primary'
            size    = 'small'
            checked = {checked}
          />
        }
        sx={{
          ml: 0,
          my: 2,
          '& .MuiFormControlLabel-label': {
            fontSize: pxToRem(14)
          }
        }}
        onChange = {handleToggle}
      />
    </Tooltip>
  );
}
