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

// @mui material components
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import { GradientColorName, GreyColor, ColorName } from 'app/providers/theme';
import { FC } from 'react';

// Material Dashboard 2 React components
import MDBox from '../../mui-design-components/md-box';
import MDTypography from '../../mui-design-components/md-typography';


interface Props {
  bgColor?: GradientColorName | GreyColor
  title: string
  count: number | string
  percentage: {
    color: ColorName
    amount: number | string
    label: string
  },
  icon: React.ReactNode
}

export const ComplexStatisticsCard: FC<Props> = ({
  bgColor = 'info',
  title,
  count,
  percentage = {
    color: 'success',
    text: '',
    label: '',
  },
  icon
}) => (
    <Card>
      <MDBox display='flex' justifyContent='space-between' pt={1} px={2}>
        <MDBox
          variant        = 'gradient'
          color          = {bgColor === 'light' ? 'dark' : 'white'}
          coloredShadow  = {bgColor}
          bgColor        = {bgColor}
          borderRadius   = 'xl'
          display        = 'flex'
          justifyContent = 'center'
          alignItems     = 'center'
          width          = '4rem'
          height         = '4rem'
          mt             = {-3}
        >
          <Icon fontSize='medium' color='inherit'>
            {icon}
          </Icon>
        </MDBox>
        <MDBox textAlign='right' lineHeight={1.25}>
          <MDTypography variant='button' fontWeight='light' color='text'>
            {title}
          </MDTypography>
          <MDTypography variant='h4'>{count}</MDTypography>
        </MDBox>
      </MDBox>
      <Divider />
      <MDBox pb={2} px={2}>
        <MDTypography component='p' variant='button' color='text' display='flex'>
          <MDTypography
            component='span'
            variant='button'
            fontWeight='bold'
            color={percentage.color}
          >
            {percentage.amount}
          </MDTypography>
          &nbsp;
{percentage.label}
        </MDTypography>
      </MDBox>
    </Card>
  )
