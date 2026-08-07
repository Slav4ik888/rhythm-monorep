import { FC, memo, useCallback, useEffect, useState } from 'react';
import { useSignup } from '../../../model';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MDButton } from 'shared/ui/mui-design-components';
import { f, pxToRem } from 'shared/styles';
import CachedIcon from '@mui/icons-material/Cached';



// Форматирование времени в формат 00:59
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};


export const CodeAgainTimer: FC = memo(() => {
  const { loading, signupData, serviceSendCodeAgain } = useSignup();
  const [timeLeft, setTimeLeft] = useState(59); // Начальное значение - 59 секунд
  const [isActive, setIsActive] = useState(true);


  useEffect(() => {
    let interval: any = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    }
    else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);


  const handleSendAgain = useCallback(() => {
    setTimeLeft(59);        // Сброс таймера
    setIsActive(true);      // Запуск таймера
    serviceSendCodeAgain(signupData); // Повторная отправка кода
  },
    [signupData, serviceSendCodeAgain]
  );


  return (
    <Box sx={f('-c-c')}>
      {isActive ? (
        <Typography sx={{ fontSize: pxToRem(10), textAlign: 'center', color: 'text.main' }}>
          Повторно запросить код можно через {formatTime(timeLeft)}
        </Typography>
      ) : (
        <MDButton
          loading   = {loading}
          variant   = 'text'
          color     = 'dark'
          children  = 'Отправить код повторно'
          startIcon = {<CachedIcon sx={{ color: 'text.main' }} />}
          sx        = {{
            root: {
              fontSize: pxToRem(10),
            }
          }}
          onClick   = {handleSendAgain}
        />
      )}
    </Box>
  )
});
