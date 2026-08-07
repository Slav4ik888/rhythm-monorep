import { FC, memo, MutableRefObject } from 'react';
import { SignupContent as Content } from './content';
import { GettingPermissionsContainer } from './getting-permissions-container';
import { ActionMain, ActionHelps } from 'shared/ui/pages/action-container';
import { Errors } from 'shared/lib/validators';



interface Props {
  loading            : boolean
  errors             : Errors
  permissins         : boolean
  companyNameRef     : MutableRefObject<null>
  firstNameRef       : MutableRefObject<null>
  emailRef           : MutableRefObject<null>
  passwordRef        : MutableRefObject<null>
  confirmRef         : MutableRefObject<null>
  onTogglePermission : () => void
  onSubmit           : () => void
}


export const SignupStartPageComponent: FC<Props> = memo(({
  loading, errors, companyNameRef, confirmRef, permissins, firstNameRef, emailRef, passwordRef,
  onSubmit, onTogglePermission
}) => (
  <>
    <Content
      companyNameRef = {companyNameRef}
      firstNameRef   = {firstNameRef}
      emailRef       = {emailRef}
      passwordRef    = {passwordRef}
      confirmRef     = {confirmRef}
    />

    <GettingPermissionsContainer
      permissins         = {permissins}
      onTogglePermission = {onTogglePermission}
    />
    <ActionMain
      type     = 'signup'
      loading  = {loading}
      errors   = {errors}
      onSubmit = {onSubmit}
    />
  </>
));
