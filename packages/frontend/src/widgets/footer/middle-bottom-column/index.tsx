import { FC, memo } from 'react';
import Typography from '@mui/material/Typography';
import { CustomTheme } from 'app/providers/theme';
import { f, getTypography } from 'shared/styles';



export const FooterBottomMiddleColumn: FC = memo(() => (
  <Typography
    sx={(theme) => {
      const { size } = getTypography(theme as CustomTheme);

      return {
        ...f('-c-c-w'),
        fontSize : size.xs,
      }
    }}
  >
    ИП Корзан Регина Олмерзаевна, ИНН 381208224610 ОГРНИП 315385000067595
  </Typography>
));
