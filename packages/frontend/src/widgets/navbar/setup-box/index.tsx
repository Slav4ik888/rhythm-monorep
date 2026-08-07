import { FC, memo } from 'react';
import { useUser } from 'entities/user';
import { MenuBtns } from './menu-bns';
import { AuthBtns } from './auth-btns';



/** Кнопки Navbar авторизация и профилей */
export const NavbarSetupBox: FC = memo(() => {
  const { auth } = useUser();

  return (
    <>
      {
        auth
          ? <MenuBtns />
          : <AuthBtns />
      }
    </>
  );
})
