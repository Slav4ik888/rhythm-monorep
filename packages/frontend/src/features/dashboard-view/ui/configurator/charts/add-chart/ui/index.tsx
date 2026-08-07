import { FC, memo, useCallback } from 'react';
import { Tooltip } from 'shared/ui/tooltip';
import { MDButton } from 'shared/ui/mui-design-components';
import AddCardIcon from '@mui/icons-material/AddCard';
import { useDashboardViewActions } from 'entities/dashboard-view';
import { isPie } from 'entities/charts';



const useStyles = () => ({
  button: {
    root: {
      fontSize: '0.7rem',
    }
  },
  icon: {
    color: '#000000',
    fontSize : '20px',
  },
});


/** AddNewChart into the charts */
export const AddNewChart: FC = memo(() => {
  const sx = useStyles();
  const { selectedItem, changeOneSettingsField } = useDashboardViewActions();

  const handleClick = useCallback(() => {
    const charts = selectedItem?.settings?.charts;
    const value = charts ? [...charts] : [];
    value.push({ chartType: selectedItem?.settings?.charts?.[0].chartType || 'line' });

    changeOneSettingsField({ field: 'charts', value });
  }, [selectedItem, changeOneSettingsField]);


  return (
    <Tooltip title={`Добавить нов${isPie(selectedItem) ? 'ую дугу' : 'ый график'}`}>
      <MDButton
        variant   = 'outlined'
        color     = 'black'
        sx        = {sx.button}
        startIcon = {<AddCardIcon sx={sx.icon} />}
        onClick   = {handleClick}
      >
        {isPie(selectedItem) ? 'дугу' : 'график'}
      </MDButton>
    </Tooltip>
  )
});
