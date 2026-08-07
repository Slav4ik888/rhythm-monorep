import { FC, memo } from 'react';
import { useTheme } from 'app/providers/theme';
import { getTypography, f } from 'shared/styles';
import Box from '@mui/material/Box';
import { ProgressiveImage } from 'shared/lib/progressiv-image';
import osnovaLogo from 'shared/assets/logos/logo_osnova.png';
import { RenderFooterLinks } from '../render-footer-links';
import { LinkType, RoutePath, AppRoutes } from 'app/providers/routes';



export const FooterTopLeftColumn: FC = memo(() => {
  const theme = useTheme();
  const { size } = getTypography(theme);


  return (
    <Box sx={{
      ...f('c-fs-fs'),
      gap: 1
    }}>
      <ProgressiveImage
        alt = 'Основа лого'
        src = {osnovaLogo}
        sx  = {{ root: { width: '5rem' } }}
      />

      <RenderFooterLinks
        links={
          [
            {
              name: 'Договор-оферта (услуги)',
              href: 'https://docs.google.com/document/d/1xNVjtf-X9G_JMFvks1gshQsUHkNum7E2AmsrH6FVKaY/edit?tab=t.0'
            },
            {
              name: 'Политика конфиденциальности',
              route: RoutePath[AppRoutes.POLICY]
            },
          ] as LinkType[]
        }
        sx={{
          label: {
            fontSize: size.xs,
          }
        }}
      />
    </Box>
  );
})
