import { FC, memo } from 'react';
import { ConfiguratorSubHeader as SubHeader } from 'shared/ui/configurators-components';
import { ItemsRows } from './items-rows';



/** Вкладка Settings for Period */
export const ViewItemPeriodSettingsConfigurator: FC = memo(() => (
  <>
    <SubHeader title='Настройки пунктов'>
      <ItemsRows />
    </SubHeader>
  </>
));
