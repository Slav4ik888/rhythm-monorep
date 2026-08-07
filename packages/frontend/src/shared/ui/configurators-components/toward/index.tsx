import { FC, memo } from 'react';
import UpwardIcon from '@mui/icons-material/ArrowUpward';
import DownwardIcon from '@mui/icons-material/ArrowDownward';
import Box from '@mui/material/Box';
import { Tooltip } from '../../tooltip';
import { MDButton } from '../../mui-design-components';
import { CustomTheme, useTheme } from 'app/providers/theme';



type TowardSize = 'small' | 'medium' | 'large'

const useStyles = (theme: CustomTheme, size?: TowardSize) => {
  const small = size === 'small';
  const styles = {
    icon: {
      color    : theme.palette.dark.main,
      fontSize : small ? '14px' : '20px',
    },
    button: {
    }
  };

  if (small) {
    (styles.button as any).minWidth = '24px';
    (styles.button as any).padding = '4px 6px';
  }

  return styles;
};


export type TowardType = 'up' | 'down'

interface Props {
  type    : TowardType
  size?   : TowardSize
  onClick : (type: TowardType) => void
}


/** Кнопки вверх/вниз */
export const Toward: FC<Props> = memo(({ type, size, onClick }) => {
  const sx = useStyles(useTheme(), size);
  const up = type === 'up';


  return (
    <Box>
      <Tooltip title={`Переместить элемент ${up ? 'вверх' : 'вниз'}`}>
        <MDButton
          variant     = 'outlined'
          color       = 'dark'
          data-testid = {up ? 'btn-up' : 'btn-down'}
          sx          = {{ root: sx.button }}
          onClick     = {() => onClick(type)}
        >
          {up ? <UpwardIcon sx={sx.icon} /> : <DownwardIcon sx={sx.icon} />}
        </MDButton>
      </Tooltip>
    </Box>
  )
});
