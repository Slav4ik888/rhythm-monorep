import { FC, memo, useCallback } from 'react';
import { DeleteButton } from 'shared/ui/buttons/delete-button';
import { useDashboardViewActions } from 'entities/dashboard-view';
import { getArrWithoutItemByIndex } from 'shared/helpers/arrays';



interface Props {
  index: number // Index charts in settings.charts
}

/** DelChart from the charts */
export const DelChart: FC<Props> = memo(({ index }) => {
  const { selectedItem, changeOneSettingsField } = useDashboardViewActions();


  const handleClick = useCallback(() => {
    const value = getArrWithoutItemByIndex(selectedItem.settings?.charts, index);

    changeOneSettingsField({ field: 'charts', value });
  }, [index, selectedItem, changeOneSettingsField]);


  return (
    <DeleteButton
      toolTitle = 'Удалить график'
      sx        = {{
        root: {
          color    : '#000000',
          fontSize : '0.7rem',
          mr       : 2,
        }
      }}
      onDel     = {handleClick}
    />
  )
});
