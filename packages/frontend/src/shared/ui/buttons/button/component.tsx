import { FC, memo, ReactNode } from 'react';
import MuiButton from '@mui/material/Button';
import { CircularProgress } from '../../circular-progress';
import { useTheme } from 'app/providers/theme';
import { Tooltip } from '../../tooltip';
import { ButtonType, Variant } from './types';
import { useStyles } from './use-styles';
import { SxCard } from 'shared/styles';



interface Props {
  id?        : string
  text       : string
  type?      : ButtonType
  toolTitle? : string
  loading?   : boolean
  disabled?  : boolean
  variant?   : Variant
  size?      : 'small' | 'medium' | 'large'
  sx?        : SxCard
  startIcon? : ReactNode
  endIcon?   : ReactNode
  onClick    : () => void
}


/** 2025-07-12 */
export const Button: FC<Props> = memo(({
  id,
  text,
  toolTitle = '',
  type      = ButtonType.PRIMARY,
  loading   = false,
  variant   = 'contained',
  size      = 'medium',
  sx        = {},
  disabled,
  startIcon,
  endIcon,
  onClick
}) => {
  const { root } = useStyles(useTheme(), sx, type, variant, disabled);


  return (
    <Tooltip title={toolTitle}>
      <MuiButton
        id        = {id}
        variant   = {variant}
        // color    = {type === ButtonType.SECONDARY ? 'secondary' : 'primary'}
        disabled  = {disabled || loading}
        size      = {size}
        startIcon = {startIcon}
        endIcon   = {endIcon}
        sx        = {root}
        onClick   = {onClick}
      >
        {/* {startIcon} */}
        {text}
        {/* {endIcon} */}
        <CircularProgress size={30} loading={loading} />
      </MuiButton>
    </Tooltip>
  )
});
