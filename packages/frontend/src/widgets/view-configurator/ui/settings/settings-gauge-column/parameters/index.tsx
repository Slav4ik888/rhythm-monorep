import { FC, memo, useCallback } from 'react';
import { useDashboardViewActions, ViewItem } from 'entities/dashboard-view';
import { GaugeColumnOneParameter } from '../one-parameter';
import { TowardType } from 'shared/ui/configurators-components';
import { getArrByToward, getArrWithoutItemByIndex } from 'shared/helpers/arrays';
import { GaugeColumnAddParameter } from '../add-parameter';



interface Props {
  selectedItem: ViewItem | undefined
}

/** Вкладка Settings for GaugeColumn */
export const GaugeColumnParameters: FC<Props> = memo(({ selectedItem }) => {
  const { updateViewItems } = useDashboardViewActions();

  const handleChangeColor = useCallback((index: number, color: string) => {
    if (! selectedItem) return

    const gaugeColumnItems = (selectedItem.settings?.gaugeColumnItems || [])
      .map((item, i) => i === index ? { ...item, color } : item);

    // Для нового (ещё не созданного элемента)
    if (index >= gaugeColumnItems.length) gaugeColumnItems.push({ color });

    updateViewItems([{
      id: selectedItem.id,
      settings: {
        gaugeColumnItems
      }
    }]);
  },
    [selectedItem, updateViewItems]
  );


  const handleToward = useCallback((index: number, type: TowardType) => {
    if (! selectedItem) return

    updateViewItems([{
      id: selectedItem.id,
      settings: {
        gaugeColumnItems: getArrByToward(
          type,
          selectedItem.settings?.gaugeColumnItems,
          index
        )
      }
    }]);
  },
    [selectedItem, updateViewItems]
  );


  const handleDel = useCallback((index: number) => {
    if (! selectedItem) return

    updateViewItems([{
      id: selectedItem.id,
      settings: {
        gaugeColumnItems: getArrWithoutItemByIndex(selectedItem.settings?.gaugeColumnItems, index)
      }
    }]);
  },
    [selectedItem, updateViewItems]
  );


  return (
    <>
      {selectedItem?.settings?.gaugeColumnItems?.map((_, index) => (
        <GaugeColumnOneParameter
          key           = {index}
          index         = {index}
          selectedItem  = {selectedItem}
          onChangeColor = {handleChangeColor}
          onToward      = {handleToward}
          onDel         = {handleDel}
        />
      ))}

      <GaugeColumnAddParameter selectedItem={selectedItem} />
    </>
  )
});
