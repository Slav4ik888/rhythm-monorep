import { FC, memo } from 'react';
import MuiDivider from '@mui/material/Divider';
import { CustomTheme } from 'app/providers/theme';



interface Props {
  withTheme? : boolean // Надо ли менять цвет в связи с темой (ночь/день)
  mt?        : number
  mb?        : number
  my?        : number
}

export const Divider: FC<Props> = memo(({ withTheme, ...rest }) => (
  <MuiDivider
    sx={(theme) => ({
      backgroundImage : `linear-gradient(90deg, transparent,
      ${withTheme ? (theme as CustomTheme).palette.text.light : 'rgba(0, 0, 0, .4)'}, transparent)`,

      backgroundColor : 'transparent',
      height          : '1px',
      border          : 'none',
      ...rest,
    })}
  />
));
