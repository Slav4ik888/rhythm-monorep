import { FC, memo } from 'react';
import { ConfiguratorTitle } from 'shared/ui/configurators-components';
import { DeleteItemContainer as DeleteItem } from 'features/dashboard-view';
import { Divider } from 'shared/ui/mui-components';



export const DangerZone: FC = memo(() => (
    <>
      <Divider mt={8} mb={2} />

      <ConfiguratorTitle title='Опасная зона' type='title1' />
      <DeleteItem />
    </>
  ));
