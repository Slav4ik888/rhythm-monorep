// packages/frontend/src/pages/signup/ui/component.tsx

import { FC, memo, ReactNode } from 'react';
import { LayoutInnerPage } from 'shared/ui/pages';
import { ProfileContentWrapper } from 'shared/ui/wrappers';
import { ActionHelps } from 'shared/ui/pages/action-container';

interface Props {
  children: ReactNode;
}

export const SignupPageComponent: FC<Props> = memo(({ children }) => (
  <LayoutInnerPage type='signup'>
    <ProfileContentWrapper>
      {children}

      <ActionHelps type='signup' />
    </ProfileContentWrapper>
  </LayoutInnerPage>
));
