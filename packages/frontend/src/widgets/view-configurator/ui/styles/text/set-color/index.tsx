import { FC, memo, useCallback } from 'react';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';
import { ViewItemStylesField, useDashboardViewActions } from 'entities/dashboard-view';
import { ColorPicker } from 'shared/lib/colors-picker';



interface Props {
  field: ViewItemStylesField
}

/** color */
export const SetColor: FC<Props> = memo(({ field }) => {
  const { selectedItem, changeOneStyleField } = useDashboardViewActions();

  const handleColor = useCallback((value: string) => {
    changeOneStyleField({ field, value, funcName: 'SetColor' });
  },
    [field, changeOneStyleField]
  );


  return (
    <RowWrapper>
      <ConfiguratorTextTitle
        bold
        title     = {field}
        toolTitle = 'color'
      />
      <ColorPicker
        defaultColor = {selectedItem?.styles?.[field] as string || ''}
        onChange     = {handleColor}
      />
    </RowWrapper>
  )
});
