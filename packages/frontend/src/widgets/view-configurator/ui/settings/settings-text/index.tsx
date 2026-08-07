import { FC, memo } from 'react';
import { ConfiguratorSubHeader as SubHeader } from 'shared/ui/configurators-components';
import { LabelRow } from './label-row';
import { ToolTitleRow } from '../base-components';



/** Вкладка Settings for Text */
export const ViewItemTextSettingsConfigurator: FC = memo(() => (
  <SubHeader title='Базовые настройки'>
    <LabelRow />
    <ToolTitleRow />
  </SubHeader>
));
