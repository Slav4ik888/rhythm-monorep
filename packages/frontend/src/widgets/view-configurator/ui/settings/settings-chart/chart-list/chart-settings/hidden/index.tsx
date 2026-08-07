import { FC, memo, useCallback, useState, useEffect } from 'react';
import { useDashboardViewActions, ViewItem } from 'entities/dashboard-view';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';
import Checkbox from '@mui/material/Checkbox';
import { isPie } from 'entities/charts';



interface Props {
  index        : number // Index charts in settings.charts
  selectedItem : ViewItem | undefined
}

/** Скрыть / показать дугу|график */
export const ChartHidden: FC<Props> = memo(({ index, selectedItem }) => {
  const isHidden = Boolean(selectedItem?.settings?.charts?.[index]?.datasets?.hidden);

  const { changeOneDatasetsItem } = useDashboardViewActions();
  const [checked, setChecked] = useState(() => isHidden);

  useEffect(() => {
    setChecked(isHidden);
  }, [isHidden]);


  const handleToggle = useCallback(() => {
    changeOneDatasetsItem({
      field : 'hidden',
      value : ! isHidden,
      index
    });
  }, [index, isHidden, changeOneDatasetsItem]);


  return (
    <RowWrapper>
      <ConfiguratorTextTitle
        bold
        title     = 'Hidden'
        toolTitle = {`Скрыть / показать ${isPie(selectedItem)} ? 'дугу' : 'график'`}
      />
      <Checkbox
        size       = 'small'
        checked    = {checked}
        inputProps = {{ 'aria-label': 'hidden' }}
        onChange   = {handleToggle}
      />
    </RowWrapper>
  )
});
