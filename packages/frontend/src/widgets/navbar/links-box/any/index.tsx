import { FC, memo, useCallback } from 'react';
import { MDTypography } from 'shared/ui/mui-design-components';
import { sxNavbarRow } from '../../styles';
import { CustomTheme } from 'app/providers/theme';
import { Link } from 'react-router-dom';
import { useCompany } from 'entities/company';
import { useUser } from 'entities/user';
import { getLinks } from './utils';
import Box from '@mui/material/Box';



export const AnyLinksBox: FC = memo(() => {
  const { auth } = useUser();
  const { companyId } = useCompany();

  const renderLinks = useCallback(() => getLinks(companyId)
    .map(({ name, route = '', requireAuth }) => {
      if (! requireAuth || (requireAuth && auth)) return (
        <Box
          key       = {name}
          component = 'li'
          sx        = {(theme) => ({
            lineHeight : 1,
            listStyle  : 'none',
            ml         : 3,
            px         : 2,

            [theme.breakpoints.down('sm')]: {
              mb: 1,
              ml: 0,
            }
          })}
        >
          <Link to={route}>
            <MDTypography
              variant    = 'body1'
              fontWeight = 'regular'
              color      = 'text'
            >
              {name}
            </MDTypography>
          </Link>
        </Box>
      )
      else return null
    }
  ),
    [auth, companyId]
  );


  return (
    <Box
      color = 'inherit'
      mb    = {{ xs: 1, md: 0 }}
      sx    = {(theme) => sxNavbarRow(theme as CustomTheme)}
    >
      {renderLinks()}
    </Box>
  );
})
