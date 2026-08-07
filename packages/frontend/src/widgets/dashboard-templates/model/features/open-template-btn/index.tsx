import { FC, memo, useCallback } from 'react';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { Tooltip } from 'shared/ui/tooltip';
import { MDButton } from 'shared/ui/mui-design-components';
import SourceIcon from '@mui/icons-material/Source';
import { pxToRem } from 'shared/styles';
import { useDashboardTemplates } from 'entities/dashboard-templates';
import { useTheme } from 'app/providers/theme';



/** Кнопка открытия окна с шаблонами */
export const OpenTemplatesBtn: FC = memo(() => {
  const theme = useTheme();
  const { opened, setOpened } = useDashboardTemplates();

  const handleClick = useCallback(() => {
    setOpened(! opened);
  },
    [opened, setOpened]
  );


  return (
    <Tooltip title='Добавить новый элемент из шаблона'>
      <MDButton
        variant   = 'outlined'
        color     = 'dark'
        onClick   = {handleClick}
        sx        = {{
          root: {
            color    : theme.palette.template.color,
            fontSize : '0.7rem'
          }
        }}
        startIcon={<SourceIcon
          sx={{
            color    : theme.palette.template.color,
            fontSize : pxToRem(20)
          }}
        />}
      >
        Templates
      </MDButton>
    </Tooltip>
  )
});
