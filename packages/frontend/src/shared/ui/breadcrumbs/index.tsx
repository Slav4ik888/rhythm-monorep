/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { FC } from 'react';

// react-router-dom components
import { Link } from 'react-router-dom';

// @mui material components
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import Home from '@mui/icons-material/Home';

// Material Dashboard 2 React components
import MDBox from '../mui-design-components/md-box';
import MDTypography from '../mui-design-components/md-typography';



interface Props {
  title: string,
  route: string[],
  light: boolean,
}

const Breadcrumbs: FC<Props> = ({ title, route, light }) => {
  const routes = route.slice(0, -1);

  return (
    <MDBox mr={{ xs: 0, xl: 8 }}>
      <MuiBreadcrumbs
        sx={{
          '& .MuiBreadcrumbs-separator': {
            // @ts-ignore
            color: ({ palette: { white, grey } }) => (light ? white.main : grey[600]),
          },
        }}
      >
        <Link to='/'>
          <MDTypography
            component='span'
            variant='body2'
            color={light ? 'white' : 'dark'}
            opacity={light ? 0.8 : 0.5}
            sx={{ lineHeight: 0 }}
          >
            <Home fontSize='small' />
          </MDTypography>
        </Link>
        {routes.map((el) => (
          <Link to={`/${el}`} key={el}>
            <MDTypography
              component='span'
              variant='button'
              fontWeight='regular'
              textTransform='capitalize'
              color={light ? 'white' : 'dark'}
              opacity={light ? 0.8 : 0.5}
              sx={{ lineHeight: 0 }}
            >
              {el}
            </MDTypography>
          </Link>
        ))}
        <MDTypography
          variant='button'
          fontWeight='regular'
          textTransform='capitalize'
          color={light ? 'white' : 'dark'}
          sx={{ lineHeight: 0 }}
        >
          {title.replace('-', ' ')}
        </MDTypography>
      </MuiBreadcrumbs>
      <MDTypography
        fontWeight='bold'
        textTransform='capitalize'
        variant='h6'
        color={light ? 'white' : 'dark'}
        noWrap
      >
        {title.replace('-', ' ')}
      </MDTypography>
    </MDBox>
  );
}


export default Breadcrumbs;
