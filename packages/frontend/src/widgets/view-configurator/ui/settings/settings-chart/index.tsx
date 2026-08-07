import { FC, memo } from 'react';
import { ChartLegends } from './chart-legends';
import { ViewItemChartSettingsList } from './chart-list';
import { ViewItemChartScaleYSettings } from './y-settings';
import { ViewItemChartScaleXSettings } from './x-settings';
import { ChartCutout } from './cutout';
import { ViewItem } from 'entities/dashboard-view';
import { ConfiguratorSubHeader as SubHeader } from 'shared/ui/configurators-components';
import { isLine, isPie } from 'entities/charts';
import { IndividualPeriodId } from './individual-period-id';
import { ViewItemChartTension } from './tension';



interface Props {
  selectedItem: ViewItem | undefined
}

/** Вкладка Settings для графиков */
export const ViewItemChartSettingsConfigurator: FC<Props> = memo(({ selectedItem }) => (
  <>
    <SubHeader title='Базовые настройки'>
      <IndividualPeriodId />
    </SubHeader>
    <ChartLegends />
    {
      isLine(selectedItem) && <ViewItemChartTension />
    }
    {
      isPie(selectedItem) && <ChartCutout selectedItem={selectedItem} />
    }

    {/* Individual charts settings */}
    <ViewItemChartSettingsList selectedItem={selectedItem} />
    {/* TODO: возможность добавлять графики */}

    <ViewItemChartScaleYSettings selectedItem={selectedItem} />
    <ViewItemChartScaleXSettings selectedItem={selectedItem} />
  </>
));
