import { FC, memo } from 'react';
import { useUI } from 'entities/ui';
import { MobileAuthBtns } from './mobile';
import { AnyAuthBtns } from './any'



/** Кнопка Navbar для входа в авторизацию */
export const AuthBtns: FC = memo(() => {
  const { isMobile } = useUI();

  return (
    <>
      {
        isMobile ? <MobileAuthBtns /> : <AnyAuthBtns />
      }
    </>
  );
});
