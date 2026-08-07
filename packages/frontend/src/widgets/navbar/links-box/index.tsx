import { FC, memo } from 'react';
import { useUI } from 'entities/ui';
import { AnyLinksBox } from './any';
import { MobileLinksBox } from './mobile';



export const NavbarLinksBox: FC = memo(() => {
  const { isMobile } = useUI();

  return (
    <>
      {
        isMobile
          ? <MobileLinksBox />
          : <AnyLinksBox />
      }
    </>
  );
});
