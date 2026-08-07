import { forwardRef, MutableRefObject } from 'react';
import { TextFieldItem } from 'shared/ui/mui-components';
import { f, pxToRem } from 'shared/styles';
import Box from '@mui/material/Box';
import { AccessLevel, CompanyDashboardMember } from 'entities/company';
import { SelectValue } from './select';
import { Errors } from 'shared/lib/validators';



interface Props {
  errors              : Errors | undefined
  selectedEmail       : string
  selectedAccessLevel : AccessLevel
  ref                 : MutableRefObject<HTMLInputElement | null>
  existingEmail       : CompanyDashboardMember | undefined // Выбранный емэйл уже есть в списке
  onSetAccessLevel    : (accessLevel: AccessLevel) => void
  onChange            : (e: any) => void
}

// Define props without 'ref' for forwardRef compatibility
type EmailContainerProps = Omit<Props, 'ref'>;


export const SelectedEmailContainer = forwardRef<null, EmailContainerProps>(({
  errors, existingEmail, selectedEmail, selectedAccessLevel, onSetAccessLevel, onChange
}, ref) => (
  <Box sx={{ ...f(), gap: 2, width: '100%', mt: 2 }}>
    <TextFieldItem
      autoFocus
      autoComplete = 'off'
      label        = 'Введите email пользователя'
      name         = 'email'
      type         = 'email'
      ref          = {ref}
      scheme       = 'email'
      errors       = {errors}
      sx           = {{ '& .MuiOutlinedInput-root': { height: pxToRem(44) } }}
      onChange     = {onChange}
    />

    <SelectValue
      selectedEmail       = {selectedEmail}
      selectedAccessLevel = {selectedAccessLevel}
      existingEmail       = {existingEmail}
      onSetAccessLevel    = {onSetAccessLevel}
    />
  </Box>
));
