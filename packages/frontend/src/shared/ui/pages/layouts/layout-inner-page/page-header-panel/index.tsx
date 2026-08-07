import { FC, memo } from 'react';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '../../../../buttons';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from 'app/providers/routes';
import { f } from 'shared/styles';



export const PageHeaderPanel: FC = memo(() => {
  const navigate = useNavigate();

  const handlerClick = () => navigate(RoutePath.ROOT);

  return (
    <Box sx={{ ...f('-c'), width: '100%', mt: 2, p: 1 }}>
      <Button
        text      = 'На главную'
        variant   = 'text'
        // type      = {ButtonType.SECONDARY}
        startIcon = {<ArrowBackIcon sx={{ color: 'text.dark' }} />}
        sx        = {{ root: { color: 'text.dark', textTransform: 'none' } }}
        onClick   = {handlerClick}
      />
    </Box>
  );
});
