import { memo, FC, MutableRefObject } from 'react';
import { TextFieldItem } from 'shared/ui/mui-components';
import { useSignup } from '../../../model/hooks';



type Props = {
  companyNameRef : MutableRefObject<null>
  firstNameRef   : MutableRefObject<null>
  emailRef       : MutableRefObject<null>
  passwordRef    : MutableRefObject<null>
  confirmRef     : MutableRefObject<null>
}


export const SignupContent: FC<Props> = memo(({
  companyNameRef, firstNameRef, emailRef, passwordRef, confirmRef
}) => {
  const { errors } = useSignup();

  return (
    <>
      <TextFieldItem
        label    = 'Название компании'
        name     = 'companyName'
        ref      = {companyNameRef}
        scheme   = 'companyName'
        errors   = {errors}
      />
      <TextFieldItem
        label    = 'Ваше имя'
        name     = 'firstName'
        ref      = {firstNameRef}
        scheme   = 'firstName'
        errors   = {errors}
      />
      <TextFieldItem
        label    = 'Введите email'
        name     = 'email'
        type     = 'email'
        ref      = {emailRef}
        scheme   = 'email'
        errors   = {errors}
      />
      <TextFieldItem
        label    = 'Введите пароль'
        name     = 'password'
        type     = 'password'
        ref      = {passwordRef}
        scheme   = 'password'
        errors   = {errors}
      />
      <TextFieldItem
        label    = 'Повторите пароль'
        name     = 'confirmPassword'
        type     = 'password'
        ref      = {confirmRef}
        scheme   = 'confirmPassword'
        errors   = {errors}
      />
    </>
  )
});
