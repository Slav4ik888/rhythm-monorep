import { FC, memo } from 'react';
import { ConfiguratorSubHeader as SubHeader, RowWrapper } from 'shared/ui/configurators-components';
import { CopyStylesViewItemBtn } from 'features/dashboard-view';



/**  */
export const StyleControl: FC = memo(() => (
  <SubHeader title='Управление стилем'>
    <RowWrapper sx={{ root: { justifyContent: 'flex-end' } }}>
      <CopyStylesViewItemBtn />
    </RowWrapper>
  </SubHeader>
));
