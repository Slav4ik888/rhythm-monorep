import { FC, memo } from 'react';
import { Tooltip } from '../../../tooltip';
import { MDButton } from '../../../mui-design-components';
import AddCardIcon from '@mui/icons-material/AddCard';
import { ViewItemType } from 'entities/dashboard-view';
import { capitalizeFirst } from 'shared/helpers/strings';
import { pxToRem } from 'shared/styles';
import { getColorByType } from '../utils/get-color-by-type';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import { useTheme } from 'app/providers/theme';



interface Props {
  type?      : ViewItemType
  title?     : string
  toolTitle? : string
  color?     : string // Если нужно НЕ из getColorByType
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  startIcon? : OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string }
  onClick    : (type: ViewItemType | undefined) => void
}

/** Btn component */
export const AddBtn: FC<Props> = memo(({ type, title, color: defaultColor, toolTitle, startIcon, onClick }) => {
  const text = capitalizeFirst(title || type || '');
  const theme = useTheme();
  const color = defaultColor || getColorByType(theme, type);
  const StartIcon = startIcon ? startIcon : AddCardIcon;

  return (
    <Tooltip title={toolTitle ? toolTitle : `Добавить новый элемент "${text}"`}>
      <MDButton
        variant   = 'outlined'
        color     = 'dark'
        sx        = {{ root: { color, fontSize: '0.7rem' } }}
        startIcon = {<StartIcon sx={{ color, fontSize: pxToRem(20) }} />}
        onClick   = {() => onClick(type)}
      >
        {text}
      </MDButton>
    </Tooltip>
  )
});
