import { FC, memo, useMemo } from 'react';
import { ViewItem, GaugeColumnItem } from 'entities/dashboard-view';
import { DisplayParameterBorder } from './border';
import { getHeight, getWidth } from '../../utils';



interface Props {
  item            : ViewItem
  isVertical      : boolean
  gaugeColumnItem : GaugeColumnItem
  isTemplate?     : boolean // если рендерится шаблон
}


export const DisplayParametersItem: FC<Props> = memo(({ item, gaugeColumnItem, isVertical, isTemplate }) => {
  // Высота in px
  const gaugeHeight = useMemo(() => (isVertical ? getHeight(item, 100) : getWidth(item, 100)) - 2,
    [item, isVertical]
  );

  // Ширина in px
  const gaugeWidth = useMemo(() => (isVertical ? getWidth(item, 30) : getHeight(item, 30)) - 2,
    [item, isVertical]
  );


  return (
    <>
      <DisplayParameterBorder
        isVertical  = {isVertical}
        color       = {item.settings?.parametersLabelColor}
        gaugeWidth  = {gaugeWidth}
        gaugeHeight = {gaugeHeight}
        value       = {gaugeColumnItem.valueLess}
      />
      <DisplayParameterBorder
        isVertical  = {isVertical}
        color       = {item.settings?.parametersLabelColor}
        gaugeWidth  = {gaugeWidth}
        gaugeHeight = {gaugeHeight}
        value       = {gaugeColumnItem.valueMore}
      />
    </>
  )
});
