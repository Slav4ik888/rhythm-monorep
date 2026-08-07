import { FC, memo } from 'react';
import Box from '@mui/material/Box';
import { ErrorBox } from '../../../containers';
import { Errors } from 'shared/lib/validators';
import { MDButton } from '../../../mui-design-components';



interface Props {
  textBtn  : string
  errors   : Errors
  loading  : boolean
  disabled : boolean
  onSubmit : () => void
}


/** Кнопка "Зарегистрироваться" | "Войти" */
export const ActionMainComponent: FC<Props> = memo(({ textBtn, loading, errors, disabled, onSubmit }) => (
  <Box sx={{ width: '100%' }}>
    <ErrorBox
      field  = 'general'
      errors = {errors}
      sx     = {{ root: { mb: 2 } }}
    />
    <MDButton
      loading  = {loading || disabled}
      color    = 'primary'
      children = {textBtn}
      sx       = {{
        root: {
          width  : '100%',
          height : '50px'
        }
      }}
      onClick  = {onSubmit}
    />
  </Box>
));
