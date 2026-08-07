import { useUI } from 'entities/ui';
import { Navigate, useLocation } from 'react-router-dom';
import { RoutePath } from '..';
import { FC } from 'react';
import { __devLog } from 'shared/lib/tests/__dev-log';



interface Props {
  children: JSX.Element
}

export const RequireAuth: FC<Props> = ({ children }) => {
  const { errorStatus } = useUI();
  const { pathname } = useLocation();


  if (errorStatus === 401) {
    __devLog('RequireAuth', `${401} redirect to LOGIN`);
    __devLog('RequireAuth', 'pathname: ', pathname);

    return <Navigate
      to    = {RoutePath.LOGIN}
      state = {{ from: pathname }}
      // replace
    />
  }
  if (errorStatus === 403) {
    __devLog('RequireAuth', `${403} redirect to ROOT`);
    __devLog('RequireAuth', 'pathname: ', pathname);

    return <Navigate
      to    = {RoutePath.ROOT}
      state = {{ from: pathname }}
      // replace
    />
  }
  return children
}
