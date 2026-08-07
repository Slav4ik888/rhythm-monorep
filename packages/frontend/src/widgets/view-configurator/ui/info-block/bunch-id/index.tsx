import { FC, memo } from 'react';
import Typography from '@mui/material/Typography';
import { pxToRem } from 'shared/styles';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';



interface Props {
  bunchId: string
}

export const BunchIdRow: FC<Props> = memo(({ bunchId }) => (
  <RowWrapper>
    <ConfiguratorTextTitle
      bold
      title     = 'BunchId'
      toolTitle = 'Item bunchId'
    />
    <Typography
      component = 'span'
      fontSize  = {pxToRem(14)}
    >
      {bunchId}
    </Typography>
  </RowWrapper>
));
