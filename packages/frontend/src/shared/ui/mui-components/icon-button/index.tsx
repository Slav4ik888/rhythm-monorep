import { FC, memo } from 'react';
import MuiIconButton from '@mui/material/IconButton';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import { Tooltip } from '../../tooltip';
import { CustomTheme } from 'app/providers/theme';



export interface SxMenuIcon {
  button? : any
  icon?   : any
}


interface Props {
  id?            : string // For Hint
  toolTitle?     : string
  disableRipple? : boolean
  disabled?      : boolean
  size?          : 'small' | 'medium' | 'large' | undefined
  sx?            : SxMenuIcon
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  icon           : OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string }
  onClick?       : (event: any) => void
}

export const IconButton: FC<Props> = memo(({
  id, sx, icon: Icon, disabled, size, disableRipple, onClick,
  toolTitle = ''
}) => (
  <Tooltip title={toolTitle}>
    <MuiIconButton
      id            = {id}
      disableRipple = {disableRipple}
      disabled      = {disabled}
      size          = {size}
      onClick       = {onClick}
      sx            = {(theme) => ({
        '&:hover svg': {
          color: (theme as CustomTheme).palette.text.dark
        },
        ...sx?.button
      })}
    >
      <Icon
        sx={(theme) => ({
          color: (theme as CustomTheme).palette.text.light,
          ...sx?.icon
        })}
      />
    </MuiIconButton>
  </Tooltip>
));
