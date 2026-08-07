import { FC, memo, ReactNode } from 'react';
import Box from '@mui/material/Box';
import { ActionToggle } from './action-toggle';
import { LayoutInnerPageType } from '../../layouts/layout-inner-page';



type Props = {
  type      : LayoutInnerPageType
  children? : ReactNode // For RecoveryPassword
}

export const ActionHelps: FC<Props> = memo(({ type, children }) => (
  <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
    <ActionToggle type={type} />
    {
      children
    }
  </Box>
));
