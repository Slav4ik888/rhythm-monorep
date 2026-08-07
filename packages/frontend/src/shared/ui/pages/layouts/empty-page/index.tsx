import { FC, memo, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from 'app/providers/routes';
import Box from '@mui/material/Box';
import { f } from 'shared/styles';
import MDButton from '../../../mui-design-components/md-button';



interface Props {
  children: ReactNode | string
}

export const LayoutEmptyPage: FC<Props> = memo(({ children }) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(RoutePath.ROOT);

  return (
    <Box
      sx={{
        ...f('c-c'),
        margin: '0 auto',
        height: '100%'
      }}
    >
      <Box
        sx={{
          ...f('-c-c'),
          height    : '20vh',
          fontSize  : '1.6rem',
          fontStyle : 'italic',
          color     : 'text.dark'
        }}
      >
        {
          children
        }
      </Box>
      <MDButton
        variant = 'gradient'
        color   = 'primary'
        type    = 'button'
        sx      = {{ root: { width : '300px' } }}
        onClick = {handleClick}
      >
        Перейти на главную
      </MDButton>
    </Box>
  );
});
