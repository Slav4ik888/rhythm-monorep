import { FC, memo } from 'react';
import { ConfiguratorSubHeader as SubHeader } from 'shared/ui/configurators-components';
import { ViewItem } from 'entities/dashboard-view';
import { SelectKodRow } from '../base-components';



interface Props {
  selectedItem: ViewItem | undefined
}

/** Вкладка Settings for List */
export const ViewItemListSettingsConfigurator: FC<Props> = memo(({ selectedItem }) => (
  <>
    <SubHeader title='Базовые настройки'>
      <SelectKodRow selectedItem={selectedItem} />
    </SubHeader>
  </>
));
