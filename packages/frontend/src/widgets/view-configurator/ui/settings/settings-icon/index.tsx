import { FC, memo } from 'react';
import { ConfiguratorSubHeader as SubHeader } from 'shared/ui/configurators-components';
import { SelectIconRow } from './select-icon-row';



/** Вкладка Settings for Icon */
export const ViewItemIconSettingsConfigurator: FC = memo(() => (
  <SubHeader title='Базовые настройки'>
    <SelectIconRow />
  </SubHeader>
));
