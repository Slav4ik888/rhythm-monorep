import { FC, memo, useCallback } from 'react';
import { useDashboardViewActions, ViewItem } from 'entities/dashboard-view';
import { getValueByScheme, setValueByScheme } from 'shared/helpers/objects';
import { SxCard } from 'shared/styles';
import { ColorPicker } from 'shared/lib/colors-picker';



interface Props {
  selectedItem : ViewItem | undefined
  scheme       : string // начиная с 1го уровня
  sx?          : SxCard
}


/**
 * Color update ViewItem
 * По схеме сохраняет изменени в selectedItem
 */
export const ColorByScheme: FC<Props> = memo(({ selectedItem, scheme, sx }) => {
  const { updateViewItems } = useDashboardViewActions();

  const handleChangeColor = useCallback((color: string) => {
    if (! selectedItem) return

    const updatedItem = {
      id: selectedItem.id,
    };
    setValueByScheme(updatedItem, scheme, color);
    updateViewItems([updatedItem]);
  },
    [selectedItem, scheme, updateViewItems]
  );


  return (
    <ColorPicker
      defaultColor = {getValueByScheme(selectedItem, scheme)}
      sx           = {sx}
      onChange     = {handleChangeColor}
    />
  )
});
