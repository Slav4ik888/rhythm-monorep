import { FC, memo, useMemo } from 'react';
import { useDashboardViewState, ViewItem, getKod } from 'entities/dashboard-view';
import { useDashboardData } from 'entities/dashboard-data';
import { ItemGaugeColumnComponent } from './component';
import { getLastItem } from 'shared/helpers/arrays';
import { getHeight, getKfCorrect, getSuitableGaugeColumnItem, getWidth } from '../utils';
import { toNumber } from 'shared/helpers/numbers';



interface Props {
  item        : ViewItem
  isTemplate? : boolean // если рендерится шаблон
}

/** Item GaugeColumn */
export const ItemGaugeColumn: FC<Props> = memo(({ item, isTemplate }) => {
  const { entities } = useDashboardViewState();
  const { activeEntities } = useDashboardData();

  // Последнее значение в выбранном периоде
  const lastItem = useMemo(() => {
    const kod       = getKod(entities, item);
    // const isInteger = item.settings?.gaugeValueType === 'integer'; // По умолчанию (при отсутствии) это fractional
    // const kfCorrect = isInteger ? 0.01 : 1; // Целые значения делим на 100, чтобы привести к дробному значению

    return toNumber((getLastItem(activeEntities[kod]?.data))) * getKfCorrect(item);
  },
    [activeEntities, entities, item]
  );

  // Параметр с удовлетворяющим условием
  const suitableParameter = useMemo(() => getSuitableGaugeColumnItem(lastItem, item?.settings?.gaugeColumnItems),
    [lastItem, item]
  );

  // Направление
  const isVertical = useMemo(() => item?.settings?.direction === 'vertical', [item]);

  // Высота
  const gaugeHeight = useMemo(() => {
    const height = getHeight(item, isVertical ? 100 : 30);

    return `${(isVertical ?  lastItem * height : height) - 2}px`; // -1px for border
  },
    [item, isVertical, lastItem]
  );

  // Ширина
  const gaugeWidth = useMemo(() => {
    const width = getWidth(item, isVertical ? 30 : 100);

    return `${(isVertical ? width : lastItem * width) - 2}px`;
  },
    [item, isVertical, lastItem]
  );


  return (
    <ItemGaugeColumnComponent
      height     = {gaugeHeight} // Высота колонки
      width      = {gaugeWidth}  // Ширина колонки
      bgColor    = {suitableParameter?.color ?? 'transparent'}
      item       = {item}
      isVertical = {isVertical}
    />
  )
});
