import { FC, memo, ReactNode } from 'react';
import { reducerSignupPage } from '../model';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components';
import { LayoutInnerPage } from 'shared/ui/pages';
import { ProfileContentWrapper } from 'shared/ui/wrappers';
import { ActionHelps } from 'shared/ui/pages/action-container';



const initialReducers: ReducersList = {
  signupPage: reducerSignupPage
};


interface Props {
  children:  ReactNode
}


export const SignupPageComponent: FC<Props> = memo(({ children }) => (
  <DynamicModuleLoader reducers={initialReducers} removeAfterUnmount>
    <LayoutInnerPage type='signup'>
      <ProfileContentWrapper>
        {children}

        <ActionHelps type='signup' />
      </ProfileContentWrapper>
    </LayoutInnerPage>
  </DynamicModuleLoader>
));
