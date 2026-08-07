import { memo } from 'react';
import { MDBox } from 'shared/ui/mui-design-components';
import { f } from 'shared/styles';
import { Divider } from 'shared/ui/mui-components';
import { LogoBtn } from 'widgets/logo-btn';



/**
 * TODO: Сделать логотипом компании клиента
 */
// eslint-disable-next-line arrow-body-style
export const SidebarLogoLabel = memo(() => (
  <>
    <MDBox
      sx={{
        ...f('-c-c'),
        textAlign: 'center',
        mb: 1,
        pt: 3,
        pb: 1,
        px: 3
      }}
    >
      <LogoBtn type='sidebar' />
      {/* <ArrowBackBtn /> */}
      {/* <MDBox
        component={NavLink}
        to = '/'
        sx = {{ ...f('-c-c'), cursor: 'pointer' }}
      > */}
        {/* <ProgressiveImage
          alt = 'Ритм'
          src = {sidebarMini ? logoSmall : rhythmLogo}
          sx={{
            root: {
              width: sidebarMini ? '1.9rem' : '7rem',
              textAlign: 'left'
            }
          }}
        /> */}

        {/* {
          ! sidebarMini && <MDBox sx={(theme: CustomTheme) => styles(theme, { sidebarMini })}>
            <Typography
              component  = 'h6'
              variant    = 'body1'
              textAlign  = 'left'
              sx         = {(theme) => ({ color: (theme as CustomTheme).palette.sidebar.logo })}
            >
              {brandName}
            </Typography>
          </MDBox>
        } */}
      {/* </MDBox> */}
    </MDBox>

    <Divider />
  </>
));
