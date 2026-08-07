import { FC, memo } from 'react';
import { MDButton } from '../../mui-design-components';
import { pxToRem } from '../../../styles';



interface Props {
  submitText? : string
  disabled?   : boolean
  loading?    : boolean // disable button if loading
  onCancel?   : () => void
  onSubmit    : () => void
}


/**
 * v.2024.11.12
 */
export const CancelSubmitBtn: FC<Props> = memo(({ submitText, disabled, loading, onCancel, onSubmit }) => (
    <>
      {
        onCancel && <MDButton
          variant  = 'outlined'
          color    = 'dark'
          disabled = {disabled || loading}
          children = 'Отмена'
          sx       = {{ root: { marginRight: pxToRem(16) } }}
          onClick  = {onCancel}
        />
      }

      <MDButton
        disabled = {disabled || loading}
        color    = 'primary'
        children = {`${submitText ? submitText : 'Сохранить'}`}
        onClick  = {onSubmit}
      />
    </>
  ));
