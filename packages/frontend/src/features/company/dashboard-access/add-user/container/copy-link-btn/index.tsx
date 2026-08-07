import { FC, useCallback } from 'react';
import { copyToClipboard } from 'shared/lib/clipboard';
import LinkIcon from '@mui/icons-material/Link';
import { Tooltip } from 'shared/ui/tooltip';
import { MDButton } from 'shared/ui/mui-design-components';
import { useTheme } from 'app/providers/theme';
import { useUI } from 'entities/ui';



export const CopyLinkBtn: FC = () => {
  const theme = useTheme();
  const { setSuccessMessage } = useUI();

  const handleClick = useCallback(() => {
    copyToClipboard(window.location.href);
    setSuccessMessage('Ссылка скопирована');
  }, [setSuccessMessage]);


  return (
    <Tooltip title='Нажмите, чтобы скопировать ссылку'>
      <MDButton
        color         = 'text'
        variant       = 'text'
        children      = 'Скопировать ссылку'
        startIcon     = {<LinkIcon />}
        onClick       = {handleClick}
        sx            = {{
          root: {
            '&.MuiButton-root': {
              textTransform: 'none',
              '& .MuiSvgIcon-root': { color: theme.palette.text.dark },
              '& .MuiButton-startIcon': { marginLeft: 0 }
            },
          }
        }}
      />
    </Tooltip>
  );
}
