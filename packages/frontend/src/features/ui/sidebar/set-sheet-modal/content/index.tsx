import { FC, memo, MouseEvent, useCallback } from 'react';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { useCompany } from 'entities/company';
import { f } from 'shared/styles';
import Box from '@mui/material/Box';
import { DefaultIconId } from 'shared/lib/icons';
import { SelectIconContainer } from '../select-icon-container';
import { Input } from 'shared/ui/containers';



const textStyle = {
  fontSize: {
    xs: '1rem'
  },
  mb: {
    xs: 1,
    sm: 2
  }
};


interface Props {
  sheetTitle     : string
  selectedIconId : DefaultIconId | null
  onSelectIcon   : (iconId: DefaultIconId) => void
  onChangeTitle  : (e: MouseEvent, v: string | number) => void

}

export const SetSheetContent: FC<Props> = memo(({ sheetTitle, selectedIconId, onSelectIcon, onChangeTitle }) => {
  const { errors } = useCompany();

  const handleSubmit = useCallback(() => {
    document.getElementById('save-sheet-btn')?.click();
  }, []);


  return (
    <DialogContent sx={{ '&.MuiDialogContent-root': { p: 0 } }}>
      <Typography sx={textStyle}>
        Выберите иконку и напишите название листа
      </Typography>

      <Box sx={{ ...f(), gap: 2 }}>
        <SelectIconContainer
          selectedIconId = {selectedIconId}
          onSelectIcon   = {onSelectIcon}
        />
        <Input
          defaultValue = {sheetTitle}
          errorField   = 'sheetTitle'
          errors       = {errors}
          onChange     = {onChangeTitle}
          onSubmit     = {handleSubmit}
          sx           = {{
            root: {
              width: '100%'
            }
          }}
        />
      </Box>
    </DialogContent>
  )
});
