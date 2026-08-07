import { CustomTheme } from 'app/providers/theme';
import { f } from 'shared/styles';


const BACKGROUND = '#b9bcf4';


/** Функция для стилей стрелки с учетом смещения */
export const getArrowStyle = (
  arrowPosition : 'top' | 'bottom' | 'left' | 'right',
  arrowOffset   : number | undefined
) => {
  const baseStyle = {
    top  : '-8px',
    left : '-8px'
  };

  switch (arrowPosition) {
    case 'top':
    case 'bottom':
      baseStyle.left = `${arrowOffset}px`;
      break;
    case 'left':
    case 'right':
      baseStyle.top = `${arrowOffset}px`;
      break;

    default: break;
  }

  return baseStyle;
};


export const useStyles = (theme: CustomTheme, isMobile: boolean) => ({
  overlay: {
    position      : 'fixed',
    top           : 0,
    left          : 0,
    width         : '100vw',
    height        : '100vh',
    pointerEvents : 'none',
    zIndex        : 10000,
  },
  container: {
    position      : 'absolute',
    background    : BACKGROUND,
    borderRadius  : '8px',
    boxShadow     : '0 4px 20px rgba(0, 0, 0, 0.15)',
    border        : `1px solid ${theme.palette.primary.main}`,
    width         : isMobile ? 'auto' : '400px',
    maxWidth      : isMobile ? 'calc(100vw - 32px)' : '400px',
    minWidth      : isMobile ? 'unset' : '300px',
    pointerEvents : 'auto',
    animation     : 'hint-appear 0.3s ease-out',
  },
  /* Стрелка-указатель */
  noArrow: {
    display: 'none'
  },
  arrow: {
    position    : 'absolute',
    width       : 0,
    height      : 0,
    borderStyle : 'solid',
  },
  arrow__none: {
  },
  /* Стрелка снизу (указывает на элемент сверху) */
  arrow__bottom: {
    bottom      : '-10px',
    left        : '50%',
    transform   : 'translateX(-50%)',
    borderWidth : '10px 8px 0 8px',
    borderColor : `${BACKGROUND} transparent transparent transparent`,
    filter      : 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1))',
  },
  /* Стрелка сверху (указывает на элемент снизу) */
  arrow__top: {
    top         : '-10px',
    left        : '50%',
    transform   : 'translateX(-50%)',
    borderWidth : '0 8px 10px 8px',
    borderColor : `transparent transparent ${BACKGROUND} transparent`,
    filter      : 'drop-shadow(0 -2px 2px rgba(0, 0, 0, 0.1))',
  },
  /* Стрелка справа (указывает на элемент слева) */
  arrow__right: {
    top         : '50%',
    right       : '-10px',
    transform   : 'translateY(-50%)',
    borderWidth : '8px 0 8px 10px',
    borderColor : `transparent transparent transparent ${BACKGROUND}`,
    filter      : 'drop-shadow(2px 0 2px rgba(0, 0, 0, 0.1))',
  },

  /* Стрелка слева (указывает на элемент справа) */
  arrow__left: {
    top         : '50%',
    left        : '-10px',
    transform   : 'translateY(-50%)',
    borderWidth : '8px 10px 8px 0',
    borderColor : `transparent ${BACKGROUND} transparent transparent`,
    filter      : 'drop-shadow(-2px 0 2px rgba(0, 0, 0, 0.1))',
  },
  content: {
    p: 2,
  },
  leftHints: {
    fontSize  : '12px',
    color     : '#6c757d',
    textAlign : 'right',
    mb        : 1,
  },
  title: {
    fontSize   : '20px',
    color      : '#333',
    lineHeight : 1.4,
    mb         : 2,
  },
  text: {
    fontSize   : '16px',
    color      : '#333',
    lineHeight : 1.4,
    my         : 2,
  },
  attention: {
    fontSize   : '16px',
    fontStyle  : 'italic',
    color      : '#741414ff',
    lineHeight : 1.4,
    mb         : 2,
  },
  actions: {
    ...f('--fe'),
    gap : 1,
    mt  : 2
  },
  btnDontShow: {
    root: {
      textTransform : 'none',
      color         : '#5b5b5b',
    }
  },
});
