import { useUser } from 'entities/user';
import { FC, memo } from 'react';
import { RootPageMeta } from './meta';
import RootAuthContainer from './root-auth-container';
import RootNotAuthContainer from './root-not-auth-container';



/** Главная страница */
export const RootPage: FC = memo(() => {
  const { auth } = useUser();

  return (
    <>
      <RootPageMeta />
      {auth ? <RootAuthContainer /> : <RootNotAuthContainer />}
    </>
  )
});
