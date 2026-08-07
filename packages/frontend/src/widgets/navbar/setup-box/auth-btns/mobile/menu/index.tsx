import { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { RoutePath } from 'app/providers/routes';
import MenuItem from '@mui/material/MenuItem';
import { CustomTheme, useTheme } from 'app/providers/theme';
import { f } from 'shared/styles';



const useStyles = (theme: CustomTheme) => ({
  item: {
    ...f('-c-c'),
    mx    : 2,
    py    : 1,
    px    : 3,
    color : theme.palette.text.dark
  }
});


type Props = {
  onClose  : () => void
}

/** Кнопка Navbar для входа в авторизацию */
export const MobileAuthBtn: FC<Props> = memo(({ onClose }) => {
  const sx = useStyles(useTheme());

  return (
    <>
      <Link to={RoutePath.SIGNUP} onClick={onClose}>
        <MenuItem sx={sx.item}>
          Регистрация
        </MenuItem>
      </Link>

      <Link to={RoutePath.LOGIN} onClick={onClose}>
        <MenuItem sx={sx.item}>
          Войти
        </MenuItem>
      </Link>
    </>
  );
});
