import * as React from 'react';
import Circular from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { f } from 'shared/styles';
import { getTopCenter } from './utils';
import { useEffect } from 'react';



type Props = {
  loading : boolean
  id?     : string
  size?   : number
  top?    : string
  bottom? : string
  right?  : string
  left?   : string
  sx?     : any
  center? : boolean // По центру
  block?  : boolean // Заблокировать экран подсветкой
  color?  : string
}



/** 2025-06-11 */
export const CircularProgress: React.FC<Props> = (props) => {
  const
    {
      loading, block, color, sx, center, top, bottom, right, left,
      id   = 'CircularId',
      size = 30
    } = props;
    // ref = React.useRef(null),
    // parentDimentions = React.useMemo(() => getParentDimentions(document.getElementById(id)), [ref.current]),
    // sx = useStyles(useTheme(), props);// , parentDimentions);


  // При block - блокируем прокрутку и фокус
  useEffect(() => {
    if (loading && block) {
      document.body.style.overflow = 'hidden';
      document.body.setAttribute('inert', ''); // Отключает фокус клавиатуры
    }
    else if (! loading && block) {
      document.body.style.overflow = '';
      document.body.removeAttribute('inert');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.removeAttribute('inert');
    }
  }, [loading, block]);


  if (! loading) return null;

  return (
    <Box
      id={id}
      sx={(theme) => {
        const root = {
          position   : 'absolute',
          width      : '100%',
          height     : '100%',
          top        : top    || 0,
          right      : right  || 0,
          bottom     : bottom || 0,
          left       : left   || 0,
          zIndex     : 9999,
          ...f('-c-c'),
          ...sx?.root
        };

        if (block) {
          root.position      = 'fixed';
          root.pointerEvents = 'none';
          root.overflow      = 'hidden';
          root.touchAction   = 'none'; /* Для мобилок */
          root.background    = theme.palette.background.default;
          root.opacity       = '60%';
        }
        return root
      }}
    >
      <Circular
        size={size}
        sx={(theme) => {
          const circular = {
            '&.MuiCircularProgress-root': {
              color: color || '#7a7a7a'
            },
            ...sx?.content
          };

          if (! block) {
            circular.position = 'absolute';
            circular.top = center ? getTopCenter(id, size) : top ? top : '';
          }
          return circular;
        }}
      />
    </Box>
  );
};
