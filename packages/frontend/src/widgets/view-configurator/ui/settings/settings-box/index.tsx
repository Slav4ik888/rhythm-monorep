import { FC, memo } from 'react';
import { InvertedData, SelectKodRow } from '../base-components';
import { ConfiguratorSubHeader as SubHeader } from 'shared/ui/configurators-components';
import { ViewItem } from 'entities/dashboard-view';



interface Props {
  selectedItem: ViewItem | undefined
}

/** Вкладка Settings for Box */
export const ViewItemBoxSettingsConfigurator: FC<Props> = memo(({ selectedItem }) => (
  <SubHeader title='Общие настройки'>
    <SelectKodRow selectedItem={selectedItem} />
    <InvertedData type={selectedItem?.type} />
  </SubHeader>
));
