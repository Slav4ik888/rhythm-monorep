import { FC, memo } from 'react';
import { useSignup } from '../../../model';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { PolicyDescription } from './policy-description';
import { ErrorBox } from 'shared/ui/containers';
import { CustomTheme, useTheme } from 'app/providers/theme';
import { f } from 'shared/styles';



const useStyles = (theme: CustomTheme) => ({
  root: {
    ...f('c-fs'),
    textAlign  : 'left',
    fontSize   : '0.8rem',
    lineHeight : 1.4,
    mt         : 4,
    mb         : 2
  },
  boxCheck: {
    ...f('-c'),
    my: 0.5
  },
  sxBox: {
    backgroundColor : theme.palette.background.paper,
    pr              : 1.1
  },
  checkbox: {
    '&.Mui-checked': {
      color: theme.palette.primary.dark
    },
    color: theme.palette.primary.dark
  }
});


type Props = {
  permissins         : boolean
  onTogglePermission : () => void
}


export const GettingPermissionsContainer: FC<Props> = memo(({ permissins, onTogglePermission }) => {
  const sx = useStyles(useTheme());
  const { errors } = useSignup();


  return (
    <Box sx={sx.root}>
      <Box sx={sx.boxCheck}>
        <Checkbox
          size       = 'small'
          checked    = {permissins}
          sx         = {sx?.root}
          onChange   = {onTogglePermission}
        />
        <PolicyDescription />
      </Box>

      {/* <FormControlLabel
        value="Разрешаю"
        control={<Checkbox className={classes.checkbox} onChange={handleChange} name="sending" />}
        label="Разрешаю отправлять на указанную электронную почту сообщения: о результатах выполненных мною заданий, об изменниях на сайте, которые могут быть мне полезны."
        labelPlacement="end"
        className={classes.label}
      /> */}

      <ErrorBox
        field  = 'permissions'
        errors = {errors}
        sx     = {{ root: { mt: 1 } }}
      />
    </Box>
  );
});
