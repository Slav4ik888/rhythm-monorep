import { FC, memo } from 'react';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { LayoutInnerPageType } from '..';



const title: Record<LayoutInnerPageType, string> = {
  'demo'            : 'Демо-страницы',
  'login'           : 'Войти',
  'signup'          : 'Регистрация',
  'user-profile'    : 'Профиль пользователя',
  'company-profile' : 'Профиль компании',
  'policy'          : 'Политика конфиденциальности',
};


interface Props {
  type: LayoutInnerPageType
}

export const PageHeaderTitle: FC<Props> = memo(({ type }) => (
  <>
    {
      type === 'login' && <Avatar sx={{ m: 1 }}>
        <LockOutlinedIcon />
      </Avatar>
    }
    <Typography component='h1' variant='h5' color='text.dark' textAlign='center' mb={2}>
      {title[type]}
    </Typography>
  </>
));
