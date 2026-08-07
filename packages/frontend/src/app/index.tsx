import { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppRouter } from './providers/routes';
import { useUser } from 'entities/user';
import { screenResizeListener, useUI } from 'entities/ui';
import './styles/index.scss';
import { useInitialEffect } from 'shared/lib/hooks';



export const App: FC = () => {
  const { auth, serviceGetAuth } = useUser();
  const { replacePath, setReplacePath, setScreenFormat } = useUI();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useInitialEffect(() => {
    serviceGetAuth({ pathname });
    // TODO: sheetId подставлять нужный
    // serviceGetStartResourseData({ pathname, sheetId: NO_SHEET_ID });
    screenResizeListener(setScreenFormat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  // Replace to saved path
  useEffect(() => {
    if (auth && replacePath) {
      // console.log(`[App]: replace to saved path: ${replacePath}`);

      setReplacePath('');
      navigate(replacePath);
    }
  }, [auth, replacePath, setReplacePath, navigate]);


  return (
    <AppRouter />
  );
};
