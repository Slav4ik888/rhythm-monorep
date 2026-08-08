import { FC, memo, useCallback, useRef } from 'react';
import type { SignupDataEnd } from '../../model';
import { useSignup } from '../../model';
import { getRefValue } from 'shared/lib/refs';
import { validateSignupDataEnd } from '../../model/validators';
import { SignupEndPageComponent } from './component';

export const SignupPageEnd: FC = memo(() => {
  const {
    loading,
    signupData: { email },
    serviceSignupEnd,
    setErrors,
  } = useSignup();
  const codeRef = useRef(null);

  const handleSubmit = useCallback(async () => {
    if (loading) return;

    const signupDataEnd: SignupDataEnd = {
      email,
      emailCode: getRefValue(codeRef),
    };

    const { valid, errors } = validateSignupDataEnd(signupDataEnd);
    if (valid) serviceSignupEnd(signupDataEnd);
    else setErrors(errors);
  }, [loading, email, serviceSignupEnd, setErrors]);

  return <SignupEndPageComponent codeRef={codeRef} onSubmit={handleSubmit} />;
});
