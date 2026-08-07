import { FC, memo, useCallback, useState } from 'react';
import { pxToRem } from 'shared/styles';
import {
  arrayDashboardPeriodType, DashboardPeriodType, DASHBOARD_PERIOD_TEXT, useDashboardData
} from 'entities/dashboard-data';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { PeriodTypeChip } from './chip';
import { useCompany } from 'entities/company';
import { CustomTheme } from 'app/providers/theme';



export const PeriodType: FC = memo(() => {
  const { paramsCompanyId } = useCompany();
  const { setSelectedPeriod } = useDashboardData();
  const [openSelect, setOpenSelect] = useState(false);


  const handleChangePeriod = useCallback((e: SelectChangeEvent) => {
    setSelectedPeriod({
      companyId : paramsCompanyId,
      period    : {
        type: e.target.value as DashboardPeriodType
      }
    });
    setOpenSelect(false);
  }, [paramsCompanyId, setSelectedPeriod]);

  const handleClickChip = () => setOpenSelect(true);
  const handleSelectClose = () => setOpenSelect(false);


  return (
    <FormControl
      id = 'period-type'
      sx = {{
        position : 'relative',
        display  : 'flex',
        width    : 120,
        mr       : 1
      }}
    >
      <PeriodTypeChip onClick={handleClickChip} />

      <Select
        variant      = 'standard'
        open         = {openSelect}
        defaultValue = ''
        onClose      = {handleSelectClose}
        onChange     = {handleChangePeriod}
        MenuProps    = {{
          PaperProps: {
            sx: (theme) => ({
              backgroundColor: (theme as CustomTheme).palette.navbar.bg
            }), // Фон списка
          },
        }}
        sx           = {{
          visibility : 'hidden',
          opacity    : 0,
          height     : pxToRem(38),
        }}
      >
        {
          arrayDashboardPeriodType.map((item) => <MenuItem
            key   = {item}
            value = {item}
            sx    = {(theme) => ({ color: (theme as CustomTheme).palette.navbar.contrastText })}
          >
            {DASHBOARD_PERIOD_TEXT[item]}
          </MenuItem>)
        }
      </Select>
    </FormControl>
  )
});
