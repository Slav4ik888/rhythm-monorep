import { ViewItemType } from 'entities/dashboard-view';
import { grey, deepOrange, teal, pink, lime, blue, blueGrey, green, purple } from '@mui/material/colors';
import { CustomTheme } from 'app/providers/theme';


export const getColorByType = (theme: CustomTheme, type?: ViewItemType) => {
  switch (type) {
    case 'box':            return deepOrange[800];
    case 'text':           return blueGrey[500];
    case 'icon':           return green[500];
    case 'divider':        return grey[800];
    case 'chart':          return teal[800];
    case 'period':         return teal[600];
    case 'chip':           return lime[900];
    case 'growthIcon':     return green[800];
    case 'digitIndicator': return blue[800];
    case 'gaugeColumn':    return purple[600];
    case 'list':           return grey[700];

    default:
      return theme.palette.dark.main;
  }
};
