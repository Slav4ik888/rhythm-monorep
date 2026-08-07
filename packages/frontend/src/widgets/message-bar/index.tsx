import { FC, memo, forwardRef, useState, useEffect } from 'react';
import { useUI } from 'entities/ui';
import MuiSnackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import cfg from 'app/config';
import { getAllObjValue, isNoEmptyFields } from 'shared/helpers/objects';



const Alert = forwardRef<HTMLDivElement, AlertProps>((
  props,
  ref,
) => <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />);



export const MessageBar: FC = memo(() => {
  const
    { message, errors, clearMessage, setWarningMessage } = useUI(),
    [isSnack, setIsSnack] = useState(false);


  // Global show errors
  useEffect(() => {
    isNoEmptyFields(errors) && setWarningMessage((getAllObjValue(errors)));
  }, [errors, setWarningMessage]);


  useEffect(() => {
    message?.message && setIsSnack(true);
  }, [message?.message]);

  const handleCloseMessageBar = () => {
    clearMessage();
    setIsSnack(false);
  };


  if (! message?.message) return null;


  return (
    <MuiSnackbar
      open             = {isSnack}
      anchorOrigin     = {{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration = {message.timeout || cfg.DEFAULT_MESSAGE_TIMEOUT}
      onClose          = {handleCloseMessageBar}
      sx               = {{
        '& .MuiAlert-filledInfo': {
          color: '#fff',
          backgroundColor: '#0d7fc7', // '#75c563',
          // '&:hover': {
          //   backgroundColor: fade('#75c563', 0.85),
          // },
        },
        '& .MuiAlert-filledSuccess': {
          color: '#146900',
          backgroundColor: '#a9e09d', // '#75c563',
          // '&:hover': {
          //   backgroundColor: fade('#75c563', 0.85),
          // },
        },
        '& .MuiAlert-filledWarning': {
          color: '#863800',
          backgroundColor: '#ffc592', // '#bb7000',
          // '&:hover': {
          //   backgroundColor: fade('#f5776e', 0.85),
          // },
        },
        '& .MuiAlert-filledError': {
          color: '#8e0000',
          backgroundColor: '#eca0a0',
          // '&:hover': {
          //   backgroundColor: fade('#f5776e', 0.85),
          // },
        },
      }}
    >
      <Alert
        // variant="outlined"
        severity = {message.type}
        onClose  = {handleCloseMessageBar}
        sx       = {{
          '& .MuiAlert-icon': {
            mr: { xs: 3, sm: 4 }
          },
          fontSize: { xs: '0.9rem', sm: '1rem' },
          alignItems: 'center',
          lineHeight: { xs: 1.5, sm: 1.7 },
          pt: { xs: 1, sm: 2 },
          pr: { xs: 3, sm: 4 },
          pb: { xs: 1, sm: 2 },
          pl: { xs: 3, sm: 4 },
          // backgroundColor: theme.palette.secondary.light,
          width: { xs: '100%', sm: '600px' },
          zIndex: 10000, // Чтобы выше PageLoader
        }}
      >
        {message.message}
      </Alert>
    </MuiSnackbar>
  );
});
