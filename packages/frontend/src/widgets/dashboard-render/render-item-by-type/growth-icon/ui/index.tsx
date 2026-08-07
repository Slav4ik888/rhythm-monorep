import { FC, memo, useMemo } from 'react';
import { useDashboardViewState, ViewItem, getKod } from 'entities/dashboard-view';
import { useDashboardData } from 'entities/dashboard-data';
import { GrowthIconComponent } from './component';
import { getIncreased, getInverted } from '../../digit-indicator';



interface Props {
  item        : ViewItem
  isTemplate? : boolean // если рендерится шаблон
}

/** Item GrowthIcon */
export const ItemGrowthIcon: FC<Props> = memo(({ item, isTemplate }) => {
  const { entities } = useDashboardViewState();
  const { activeEntities } = useDashboardData();

  const increased = useMemo(() => getIncreased(getInverted(item, entities), activeEntities, getKod(entities, item)),
    [activeEntities, entities, item]
  );

  return (
    <GrowthIconComponent
      increased      = {isTemplate ? 1 : increased}
      unchangedBlack = {item.settings?.unchangedBlack}
      isLeft         = {item.settings?.isLeft}
      scale          = {item.settings?.scale}
      sx             = {{}}
    />
  )
});
