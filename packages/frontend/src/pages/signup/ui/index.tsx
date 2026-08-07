import { FC, memo, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AppRoutes, RoutePath } from 'app/providers/routes';
import { useSignup } from '../model';
import { useUser } from 'entities/user';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { SignupPageEnd } from './end-component';
import { SignupPageStart } from './start-component';
import { SignupPageComponent } from './component';



const SignupPage: FC = memo(() => {
  const { loading: userLoading, auth } = useUser();
  const { codeSended } = useSignup();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      navigate(RoutePath[AppRoutes.ROOT]);
    }
  },
    [auth, navigate]
  );


  if (auth) return <Navigate to={RoutePath[AppRoutes.ROOT]} replace />;
  if (userLoading) return null;


  return (
    <SignupPageComponent>
      {
        codeSended
          ? <SignupPageEnd />
          : <SignupPageStart />
      }
    </SignupPageComponent>
  )
});

export default SignupPage;
