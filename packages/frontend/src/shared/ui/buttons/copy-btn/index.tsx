import { FC, memo, useEffect, useState } from 'react';
import CopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton } from '../../mui-components';
import { copyToClipboard } from 'shared/lib/clipboard';
import CheckIcon from '@mui/icons-material/Check';
import { CustomTheme, useTheme } from 'app/providers/theme';
import { useUI } from 'entities/ui';



const useStyles = (theme: CustomTheme, copied: boolean, style: any) => {
  const sx: any = {
    icon: {
      fontSize : '14px',
      ...style
    }
  }

  if (copied) {
    sx.icon.color      = theme.palette.success.main;
    sx.icon['&:hover'] = theme.palette.success.main;
  }

  return sx
}


interface Props {
  value     : string // Копируемое значение, в тч после изменения которого надо вернуть copied to false
  toolTitle : string
  sx?       : any
}

export const CopyBtn: FC<Props> = memo(({ value, toolTitle, sx }) => {
  const { setSuccessMessage } = useUI();
  const [copied, setCopied] = useState(false);
  const { icon } = useStyles(useTheme(), copied, sx);


  useEffect(() => {
    setCopied(false);
  },
    [value]
  );

  const handleCopy = () => {
    copyToClipboard(value);
    if (copied) setSuccessMessage('Скопировано');
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <IconButton
      toolTitle = {toolTitle}
      icon      = {copied ? CheckIcon : CopyIcon}
      sx        = {{ icon }}
      onClick   = {handleCopy}
    />
  )
});
