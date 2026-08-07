import { useCallback, FC, memo } from 'react';
import { UseGroup, useValue } from 'shared/lib/hooks';
import { ConfirmType, DialogConfirm } from '../../dialogs';
import { MDButton } from '../../mui-design-components';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '../../tooltip';
import { SxCard } from '../../../styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { getIconStyle } from '../../configurators-components';
import { CustomTheme, useTheme } from 'app/providers/theme';
import IconButton from '@mui/material/IconButton';



type Props = {
  sx?                : SxCard
  toolTitle?         : string
  toolTitleDisabled? : string
  icon?              : boolean // Кнопка в виде иконки
  iconInBtn?         : boolean // Иконка в кнопке
  disabled?          : boolean | undefined
  hookOpen?          : UseGroup<unknown>
  onDel?             : () => void
  onClose?           : () => void
}


/** v.2025-07-20 */
export const DeleteButton: FC<Props> = memo(({
  sx, disabled, iconInBtn, icon, hookOpen,
  toolTitle         = '',
  toolTitleDisabled = '',
  onClose, onDel
}) => {
  const confirm = useValue();
  const theme = useTheme();


  const handlerDel = useCallback(() => {
    if (disabled) return

    confirm.setClose();
    hookOpen && hookOpen.setClose();
    onClose && onClose();
    onDel && onDel();
  },
    [disabled, hookOpen, confirm, onClose, onDel]
  );


  const handlerCancel = useCallback(() => {
    confirm.setClose();
  }, [confirm]);


  const handlerClick = useCallback(() => {
    if (disabled) return

    confirm.setOpen();
  },
    [confirm, disabled]
  );


  if (! onDel) return null


  return (
    <>
      <Tooltip title={disabled ? toolTitleDisabled : toolTitle}>
        {
          icon
            ? (
              <IconButton
                color   = 'inherit'
                onClick = {handlerClick}
                sx      = {{
                  cursor: disabled ? 'default' : 'pointer',
                  ...sx?.root
                }}
              >
                <DeleteOutlineIcon
                  sx={(theme) => ({
                    ...getIconStyle(theme as CustomTheme, disabled ? 'empty' : 'default'),
                    ...sx?.icon
                  })}
                />
              </IconButton>
            )
            : (
              <MDButton
                color     = 'error'
                children  = 'Удалить'
                variant   = 'outlined'
                disabled  = {disabled}
                startIcon = {iconInBtn && <DeleteIcon />}
                sx={{
                  root: {
                    color: theme.palette.error.main,
                    ...sx?.root
                  }
                }}
                onClick   = {handlerClick}
              />
            )
        }
      </Tooltip>

      <DialogConfirm
        open     = {confirm.open}
        typeOk   = {ConfirmType.DEL}
        title    = 'Подтверждение удаления'
        onCancel = {handlerCancel}
        onOk     = {handlerDel}
      />
    </>
  );
});
