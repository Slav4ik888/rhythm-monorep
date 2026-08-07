import { FC, memo } from 'react';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';
import Box from '@mui/material/Box';



interface Props {
  order: number
}

/** order in parents */
export const ItemOrder: FC<Props> = memo(({ order }) => (
  <RowWrapper>
    <ConfiguratorTextTitle bold title='Order' toolTitle='' />
    <Box sx={{ fontSize: '1rem' }}>
      {order}
    </Box>
  </RowWrapper>
));
