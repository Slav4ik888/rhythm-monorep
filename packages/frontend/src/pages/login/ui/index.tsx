import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { useLogin } from '../model';
import { getRefValue } from 'shared/lib/refs';
import { AuthByLogin } from '../model/services';
import { validateAuthByLogin } from '../model/validators';
import { LoginPageComponent } from './component';
import { useUI } from 'entities/ui';
import { AppRoutes, RoutePath } from 'app/providers/routes';
import { Navigate, useNavigate } from 'react-router-dom';
import { useUser } from 'entities/user';



const LoginPage: FC = memo(() => {
  const { setErrorStatus } = useUI();
  const { loading: userLoading, auth } = useUser();
  const { loading, errors, setErrors, serviceAuthByLogin } = useLogin();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    if (auth) {
      navigate(RoutePath[AppRoutes.ROOT]);
    }
  }, [auth, navigate]);


  useEffect(() => {
    // Обнулить если была записана ошибка, например 401, 403...
    setErrorStatus(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlerSubmit = useCallback(() => {
    if (loading) return;

    const userData: AuthByLogin = {
      email    : getRefValue(emailRef).toLocaleLowerCase(),
      password : getRefValue(passwordRef)
    };

    const { valid, errors } = validateAuthByLogin(userData);
    if (! valid) setErrors(errors);
    else serviceAuthByLogin(userData);
  },
    [loading, serviceAuthByLogin, setErrors]
  );


  if (auth) return <Navigate to={RoutePath[AppRoutes.ROOT]} replace />;
  if (userLoading) return null;

  return (
    <LoginPageComponent
      loading     = {loading}
      emailRef    = {emailRef}
      passwordRef = {passwordRef}
      errors      = {errors}
      onSubmit    = {handlerSubmit}
    />
  );
});


export default LoginPage;
