import { FC, memo } from 'react';
import { f, pxToRem } from 'shared/styles';
import Box from '@mui/material/Box';
import { ProgressiveImage } from 'shared/lib/progressiv-image';
import Link from '@mui/material/Link';
import dzenLogo from 'shared/assets/social/dzen.png';
import telegramLogo from 'shared/assets/social/telegram-2.png';



export const FooterTopRightColumn: FC = memo(() => (
  <Box sx={{
    ...f('-fs-fe'),
    gap: 2
  }}>
    <Link
      href   = 'https://t.me/osnova_be_the_best/13'
      target = '_blank'
      rel    = 'noopener noreferrer'
    >
      <ProgressiveImage
        alt       = 'Телеграм канал'
        src       = {telegramLogo}
        toolTitle = 'Перейти в наш Телеграм-канал... и пожалуйста подпишитесь! Нам очень нужна Ваша поддержка 🙏!'
        sx        = {{ root: { width: '1.5rem', cursor: 'pointer' } }}
      />
    </Link>
    <Link
      href   = 'https://dzen.ru/rhythm'
      target = '_blank'
      rel    = 'noopener noreferrer'
    >
      <ProgressiveImage
        alt       = 'Дзен канал'
        src       = {dzenLogo}
        toolTitle = 'Перейти на наши статьи в Дзен... и пожалуйста подпишитесь! Нам очень нужна Ваша поддержка 🙏!'
        sx        = {{ root: { width: '1.5rem', cursor: 'pointer' } }}
      />
    </Link>
  </Box>
));
