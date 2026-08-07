import * as React from 'react';
import { Link } from 'react-router-dom';
import { RoutePath } from 'app/providers/routes';
import rhythmLogo from 'shared/assets/logos/logo_rhythm4.png';
import logoSmall from 'shared/assets/logos/logo_rhythm_small.png';
import { ProgressiveImage } from 'shared/lib/progressiv-image';
import { useUI } from 'entities/ui';



export type LogoBtnType = 'header' | 'sidebar';


type Props = {
  type?: LogoBtnType
}


// Кнопка логотипа
export const LogoBtn: React.FC<Props> = ({ type = 'header' }) => {
  const { isMobile, sidebarMini } = useUI();
  const isSmall = (isMobile && type !== 'sidebar') || (type === 'sidebar' && sidebarMini && !isMobile);

  return (
    <Link to={RoutePath.ROOT}>
      <ProgressiveImage
        alt = 'Ритм'
        src = {isSmall ? logoSmall : rhythmLogo}
        sx  = {{
          root: {
            width: isSmall ? '1.9rem' : '7rem'
          }
        }}
      />
    </Link>
  )
};
