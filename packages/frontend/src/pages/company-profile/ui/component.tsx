import { FC, memo, ChangeEvent } from 'react';
import { Errors } from 'shared/lib/validators';
import { Company } from 'entities/company';
import { Actions } from 'shared/ui/buttons';
import { f, pxToRem } from 'shared/styles';
import Box from '@mui/material/Box';
import { TextFieldItem } from 'shared/ui/mui-components';
import { LayoutInnerPage } from 'shared/ui/pages';
import { ErrorBox } from 'shared/ui/containers';



interface Props {
  loading   : boolean
  isChanges : boolean
  formData  : Partial<Company>
  errors    : Errors
  onCancel  : () => void
  onChange  : (e: ChangeEvent<HTMLInputElement>, scheme: string) => void
  onSubmit  : () => void
}


export const CompanyProfilePageComponent: FC<Props> = memo(({ isChanges, formData,
  loading, errors, onCancel, onSubmit, onChange
}) => (
  <LayoutInnerPage type='company-profile'>
    <Box sx={{ ...f('c'), gap: 4, width: { xs: '100%', md: '50%' }, maxWidth: pxToRem(300) }}>
      <TextFieldItem
        label        = 'Название компании'
        name         = 'companyName'
        defaultValue = {formData.companyName || ''}
        scheme       = 'companyName'
        errors       = {errors}
        onChange     = {onChange}
      />
      <TextFieldItem
        label        = 'Ссылка для загрузки из гугл таблицы'
        name         = 'url'
        defaultValue = {formData.googleData?.url || ''}
        scheme       = 'googleData.url'
        errors       = {errors}
        onChange     = {onChange}
      />
      <TextFieldItem
        disabled
        label        = 'Владелец аккаунта'
        name         = 'owner'
        defaultValue = {formData.owner || ''}
        scheme       = 'owner'
        errors       = {errors}
        onChange     = {onChange}
      />
      <TextFieldItem
        disabled
        label        = 'Статус аккаунта'
        name         = 'status'
        defaultValue = {formData.status || ''}
        scheme       = 'status'
        errors       = {errors}
        onChange     = {onChange}
      />
    </Box>

    <ErrorBox
      all
      errors = {errors}
      sx     = {{ root: { mt: 2 } }}
    />

    <Actions
      hideIfNotChanges
      loading   = {loading}
      isChanges = {isChanges}
      onCancel  = {onCancel}
      onSubmit  = {onSubmit}
    />
  </LayoutInnerPage>
));
