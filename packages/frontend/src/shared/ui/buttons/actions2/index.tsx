import { FC } from 'react';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { BoxGrow } from '../../containers';
import { CancelSubmitBtn } from '../cancel-submit-btn';
// import { DeleteButton } from '../delete-button';
import { f } from 'shared/styles';
import { DeleteButton } from '../delete-button';



type Props = {
  loading           : boolean
  // disabledDelete?   : boolean
  isChanges         : boolean
  hideIfNotChanges? : boolean // hide button if no changes in hookOpen.isChanges
  submitText?       : string
  onDel?            : () => void
  onCancel?         : () => void
  onSubmit          : () => void
}


/**
 * v.2025-06-15
 * Actions: Delete? Cancel? Submit
 */
export const Actions: FC<Props> = ({ loading, hideIfNotChanges, isChanges, submitText,
  onCancel, onDel, onSubmit
}) => {
  if (hideIfNotChanges && ! isChanges) return null;

  return (
    <Box sx={{ ...f('c-fe'), py: 2 }}>
      <Divider sx={{ width: '100%', mb: 4 }} />
      <Box sx={{ ...f('--sb'), width: '100%' }}>

        {/* <DeleteButton
          hookOpen = {hookOpen}
          disabled = {disabledDelete}
          onDel    = {onDel}
        /> */}

        <BoxGrow />

        <CancelSubmitBtn
          loading    = {loading}
          disabled   = {! isChanges}
          submitText = {submitText}
          onCancel   = {onCancel}
          onSubmit   = {onSubmit}
        />
      </Box>
    </Box>
  );
};
