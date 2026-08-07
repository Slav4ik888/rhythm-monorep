import { ChangeEvent, FC, memo } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { useTheme } from 'app/providers/theme';
import { Button, ButtonType } from 'shared/ui/buttons';
import { useStyles } from './styles';



interface Props {
  check    : boolean
  onChange : (e: ChangeEvent<HTMLInputElement>) => void
  onAccept : () => void
}

export const AcceptCookieComponent: FC<Props> = memo(({ check, onChange, onAccept }) => {
  const { root, form, btn } = useStyles(useTheme());

  return (
    <Box sx={root}>
      <FormControlLabel
        value          = 'Разрешаю'
        label          = {`Этот сайт использует cookie и другие технологии для вашего удобства пользования сайтом.
 Продолжая использование сайта, Вы даете согласие на работу с этими файлами.`}
        labelPlacement = 'end'
        sx             = {form}
        control        = {<Checkbox
          color    = 'secondary'
          sx       = {{ mr: 1 }}
          name     = 'accept-cookie'
          onChange = {onChange}
        />}
      />
      {/* <Box className={classes.checkbox__container}>
        <Checkbox className={classes.checkbox} onChange={handlerChange} name="accept-cookie" />
          <Box className={classes.label}>Этот сайт использует &nbsp;
          <Link className={classes.link} to={`#`}>cookie</Link>
          &nbsp;и другие технологии для вашего удобства пользования сайтом. Продолжая использование сайта, Вы даете согласие на работу с этими файлами.
        </Box>
      </Box> */}

      <Button
        type     = {ButtonType.SECONDARY}
        disabled = {! check}
        variant  = 'outlined'
        text     = 'Согласен'
        sx       = {btn}
        onClick  = {onAccept}
      />
    </Box>
  );
});
