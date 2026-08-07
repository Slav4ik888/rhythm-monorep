import { FC, memo, useEffect } from 'react';
import { useUI, PageLoadingValue } from 'entities/ui';
import Box from '@mui/material/Box';
import { f } from 'shared/styles';
import { PageLoaderRow } from './row';
import {  } from 'entities/ui/model/slice/state-schema';



type Props = {
  loading : boolean
  text?   : string
}

/** v.2025-07-06 */
export const PageLoaderContainer: FC<Props> = memo(({ loading, text }) => {
  const { pageLoading } = useUI();


  // При block - блокируем прокрутку и фокус
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
      document.body.setAttribute('inert', ''); // Отключает фокус клавиатуры
    }
    else if (! loading) {
      document.body.style.overflow = '';
      document.body.removeAttribute('inert');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.removeAttribute('inert');
    }
  }, [loading]);


  return (
    <Box
      id='PageLoaderText'
      sx={(theme) => ({
        position      : 'fixed',
        width         : '100%',
        height        : '100%',
        top           : 0,
        right         : 0,
        bottom        : 0,
        left          : 0,
        pointerEvents : 'none',
        overflow      : 'hidden',
        touchAction   : 'none', /* Для мобилок */
        background    : theme.palette.background.default,
        opacity       : '60%',

        zIndex        : 9999,
        ...f('-c-c'),
      })}
    >
      <Box sx={{ ...f('c-fs-fe'), minWidth: '30%', gap: 1 }}>
        {
          Object.entries(pageLoading).map(([key, value]) => (
            <PageLoaderRow key={key} text={(value as PageLoadingValue).text} />
          ))
        }
        {text && <PageLoaderRow text={text} />}
      </Box>
    </Box>
  )
});
