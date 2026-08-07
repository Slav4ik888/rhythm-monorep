import { FC, memo } from 'react';
import { ConfiguratorSubHeaderActive as SubHeaderActive } from 'shared/ui/configurators-components';
import { SetColor } from '../text/set-color';



export const IconStylesBox: FC = memo(() => (
  <SubHeaderActive title='Стиль иконки'>
    <SetColor field='iconColor' />
  </SubHeaderActive>
));
