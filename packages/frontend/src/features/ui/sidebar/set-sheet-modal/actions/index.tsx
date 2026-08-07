import { FC, memo } from 'react';
import DialogActions from '@mui/material/DialogActions';
import { ErrorBox } from 'shared/ui/containers';
import { SetSheetSubmitBtn as SubmitBtn } from './submit-btn';
import { f } from 'shared/styles';
import { useCompany } from 'entities/company';
import { DefaultIconId } from 'shared/lib/icons';
import { DeleteSheetBtn } from './delete-sheet-btn';
import Box from '@mui/material/Box';
import { MoveSheetUpdownward } from '../../move-sheet-up-downward';



interface Props {
  editId         : string | undefined  // sheetId if edit
  selectedIconId : DefaultIconId | null
  sheetTitle     : string
  onClose        : () => void
}


export const SetSheetActions: FC<Props> = memo(({ editId, selectedIconId, sheetTitle, onClose }) => {
  const { errors } = useCompany();

  return (
    <DialogActions sx={{ ...f('c'), p  : 0, mt : 2 }}>
      <ErrorBox
        // field  = 'general'
        all
        errors = {errors}
        sx     = {{
          root: {
            mt: 1
          }
        }}
      />

      <Box
        sx={{
          ...(editId ? f('-c-sb') : f('-c-fe')),
          width: '100%'
        }}
      >
        {editId && (
          <DeleteSheetBtn
            editId  = {editId}
            onClose = {onClose}
          />
        )}

        <Box
          sx={{
            ...f('-c-fe'),
            gap: 1
          }}
        >
          {editId && (<MoveSheetUpdownward editId={editId} />)}

          <SubmitBtn
            editId         = {editId}
            sheetTitle     = {sheetTitle}
            selectedIconId = {selectedIconId}
            onClose        = {onClose}
          />
        </Box>
      </Box>
    </DialogActions>
  )
});
