import { FC, memo, ChangeEvent } from 'react';
import { Errors } from 'shared/lib/validators';
import { Actions } from 'shared/ui/buttons';
import { User } from 'entities/user';
import Box from '@mui/material/Box';
import { TextFieldItem } from 'shared/ui/mui-components';
import { f, pxToRem } from 'shared/styles';
import { LayoutInnerPage } from 'shared/ui/pages';



interface Props {
  loading   : boolean
  isChanges : boolean
  formData  : User
  errors    : Errors
  onCancel  : () => void
  onChange  : (e: ChangeEvent<HTMLInputElement>, scheme: string) => void
  onSubmit  : () => void
}


export const UserProfilePageComponent: FC<Props> = memo(({ loading, errors, formData, isChanges,
  onCancel, onChange, onSubmit }) => (
  <LayoutInnerPage type='user-profile'>
    <Box sx={{ ...f('c'), gap: 4, width: {  xs: '100%', md: '50%' }, maxWidth: pxToRem(300) }}>
      <TextFieldItem
        label        = 'Фамилия'
        name         = 'secondName'
        defaultValue = {formData.person?.fio?.secondName}
        scheme       = 'person.fio.secondName'
        errorScheme  = 'secondName'
        errors       = {errors}
        onChange     = {onChange}
      />

      <TextFieldItem
        label        = 'Имя'
        name         = 'firstName'
        defaultValue = {formData.person?.fio?.firstName}
        scheme       = 'person.fio.firstName'
        errorScheme  = 'firstName'
        errors       = {errors}
        onChange     = {onChange}
      />

      <TextFieldItem
        label        = 'Отчество'
        name         = 'middleName'
        defaultValue = {formData.person?.fio?.middleName}
        scheme       = 'person.fio.middleName'
        errorScheme  = 'middleName'
        errors       = {errors}
        onChange     = {onChange}
      />

      <TextFieldItem
        disabled
        label        = 'Email'
        name         = 'email'
        defaultValue = {formData.email}
        scheme       = 'email'
        errors       = {errors}
        onChange     = {onChange}
      />
    </Box>

    <Actions
      hideIfNotChanges
      loading   = {loading}
      isChanges = {isChanges}
      onCancel  = {onCancel}
      onSubmit  = {onSubmit}
    />
  </LayoutInnerPage>
));
