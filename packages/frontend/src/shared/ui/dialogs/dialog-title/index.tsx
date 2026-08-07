import * as React from 'react';
import MuiDialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpIcon from '@mui/icons-material/Help';
import { f } from 'shared/styles';
import { CustomTheme } from 'app/providers/theme';



enum QuestionIconType {
  HelpOutlined = 'HelpOutlined',
  Help = 'Help',
}


type Props = {
  children?         : string
  question?         : string
  questionIconType? : QuestionIconType
  onClose           : () => void
}


export const DialogTitle: React.FC<Props> = (props: Props) => {
  const { children, question, questionIconType, onClose, ...other } = props;

  let helpIcon: JSX.Element;
  switch (questionIconType) {
    case QuestionIconType.Help: helpIcon = <HelpIcon />; break;
    case QuestionIconType.HelpOutlined: helpIcon = <HelpOutlinedIcon />; break;
    default: helpIcon = <HelpIcon />;
  }


  return (
    <MuiDialogTitle
      sx={(theme) => ({
        ...f('-c'),
        background : (theme as CustomTheme).palette.dialog.title.background,
        minHeight  : '62px',
        m          : 0,
        p          : 0
      })}
      {...other}
    >
      <Typography
        variant   = 'h6'
        component = 'div'
        sx        = {{
          textAlign : 'center',
          width     : '100%',
          ml        : 2,
          pl        : 4
        }}
      >
        {
          children
        }
      </Typography>
      {
        question ? (
          <Tooltip title={question} placement='bottom' arrow>
            <IconButton aria-label='question'>
              {
                helpIcon
              }
            </IconButton>
          </Tooltip>
        ) : null
      }
      {
        onClose ? (
          <IconButton onClick={onClose} aria-label='close' sx={{ mr: 1 }}>
            <CloseIcon />
          </IconButton>
        ) : null
      }
    </MuiDialogTitle>
  );
};
