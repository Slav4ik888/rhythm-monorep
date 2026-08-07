import { FC, memo, ReactNode } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { PageHeaderPanel } from './page-header-panel';
import { Breakpoint } from '@mui/material/styles';
import { f } from 'shared/styles';
import { PageHeaderTitle } from './page-header-title';



export type LayoutInnerPageType =
  | 'demo'
  | 'signup'
  | 'login'
  | 'user-profile'
  | 'company-profile'
  | 'policy'


interface Props {
  type           : LayoutInnerPageType
  containerType? : Breakpoint
  children       : ReactNode
}

/**
 * Layout для внутренних страниц - SignupPage | LoginPage | UserProfilePage | CompanyProfilePage...
 */
export const LayoutInnerPage: FC<Props> = memo(({ type, containerType = 'sm', children }) => (
  <Box sx={{ ...f('c-c'), width: '100%', mb: 'auto' }}>
    <PageHeaderPanel />
    <PageHeaderTitle type={type} />

    <Container
      maxWidth = {containerType}
      sx={{
        ...f('c-c'),
        position : 'relative',
        width    : '100%',
        my: 4,
        py: { md: 4, xs: 0 },
      }}
    >
      {
        children
      }
    </Container>
  </Box>
));
