import { FC, memo } from 'react';
import { ViewItem } from 'entities/dashboard-view';
import { ViewItemChartSettingsConfigurator as ChartSettings } from './settings-chart';
import { ViewItemChipSettingsConfigurator as ChipSettings } from './settings-chip';
import { ViewItemGrowthIconSettingsConfigurator as GrowthIconSettings } from './settings-growth-icon';
import { ViewItemDigitIndicatorSettingsConfigurator as DigitIndicatorSettings } from './settings-digit-indicator';
import { ViewItemBoxSettingsConfigurator as BoxSettings } from './settings-box';
import { ViewItemGaugeColumnSettingsConfigurator as GaugeColumnSettings } from './settings-gauge-column';
import { ViewItemListSettingsConfigurator as ListSettings } from './settings-list';
import { ViewItemTextSettingsConfigurator as TextSettings } from './settings-text';
import { ViewItemPeriodSettingsConfigurator as PeriodSettings } from './settings-period';
import { ViewItemIconSettingsConfigurator as IconSettings } from './settings-icon';



interface Props {
  selectedItem: ViewItem | undefined
}

export const ViewItemConfiguratorSettings: FC<Props> = memo(({ selectedItem: item }) => {
  if (item?.type === 'box')            return <BoxSettings            selectedItem={item} />
  if (item?.type === 'text')           return <TextSettings />
  if (item?.type === 'icon')           return <IconSettings />
  if (item?.type === 'chart')          return <ChartSettings          selectedItem={item} />
  if (item?.type === 'period')         return <PeriodSettings />
  if (item?.type === 'chip')           return <ChipSettings           selectedItem={item} />
  if (item?.type === 'growthIcon')     return <GrowthIconSettings     selectedItem={item} />
  if (item?.type === 'digitIndicator') return <DigitIndicatorSettings selectedItem={item} />
  if (item?.type === 'gaugeColumn')    return <GaugeColumnSettings    selectedItem={item} />
  if (item?.type === 'list')           return <ListSettings           selectedItem={item} />

  return (<></>)
});
