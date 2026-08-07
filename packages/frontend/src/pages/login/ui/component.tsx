import { FC, memo, MutableRefObject } from 'react';
import { ActionMain, ActionHelps } from 'shared/ui/pages/action-container';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components';
import { reducer as reducerLoginPage } from '../model/slice';
import { Errors } from 'shared/lib/validators';
import { LayoutInnerPage } from 'shared/ui/pages';
import { ProfileContentWrapper } from 'shared/ui/wrappers';
import { TextFieldItem } from 'shared/ui/mui-components';
import { RecoveryPassword } from './recovery-password';



const reducers: ReducersList = {
  loginPage: reducerLoginPage
};


interface Props {
  loading     : boolean
  emailRef    : MutableRefObject<null>
  passwordRef : MutableRefObject<null>
  errors      : Errors
  onSubmit    : () => void
}


export const LoginPageComponent: FC<Props> = memo(({ emailRef, passwordRef, errors, loading, onSubmit }) => (
  <DynamicModuleLoader reducers={reducers} removeAfterUnmount>
    <LayoutInnerPage type='login'>
      <ProfileContentWrapper>
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

        <ActionMain
          type     = 'login'
          loading  = {loading}
          errors   = {errors}
          onSubmit = {onSubmit}
        />
        <ActionHelps type='login'>
          <RecoveryPassword />
        </ActionHelps>
      </ProfileContentWrapper>
    </LayoutInnerPage>
  </DynamicModuleLoader>
));
