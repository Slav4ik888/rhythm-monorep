import { CustomTheme } from 'app/providers/theme';
import { pxToRem } from 'shared/styles';


/** Style for Configurator`s icon */
export const getIconStyle = (
  theme : CustomTheme,
  type? : 'default' | 'hover' | 'empty'
) => {
  let color = theme.palette.configurator.icon.default;

  if (type === 'hover') color = theme.palette.configurator.icon.hover;
  if (type === 'empty') color = theme.palette.configurator.icon.empty;

  return ({
    color,
    fontSize : pxToRem(22),
    cursor   : 'pointer'
  })
};
