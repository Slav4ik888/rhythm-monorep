import { FC, memo } from 'react';
import { InvertedData, UnchangedBlack, SelectKodRow, ToolTitleRow } from '../base-components';
import { IsLeft } from './is-left';
import { ScaleValue } from './scale-value';
import { ViewItem } from 'entities/dashboard-view';
import { ConfiguratorSubHeader as SubHeader } from 'shared/ui/configurators-components';



interface Props {
  selectedItem: ViewItem | undefined
}

/** Вкладка Settings for GrowthIcon */
export const ViewItemGrowthIconSettingsConfigurator: FC<Props> = memo(({ selectedItem }) => (
  <>
    {/* GLOBAL SETTINGS */}
    <SubHeader title='Базовые настройки'>
      <SelectKodRow selectedItem={selectedItem} />
      <InvertedData type={selectedItem?.type} />
      <UnchangedBlack />
      <ToolTitleRow />
    </SubHeader>

    {/* GROWTH ICON SETTINGS */}
    <SubHeader title='Особые настройки'>
      <IsLeft />
      <ScaleValue selectedItem={selectedItem} />
    </SubHeader>
  </>
));
