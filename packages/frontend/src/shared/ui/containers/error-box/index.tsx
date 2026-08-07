import { FC, memo } from 'react';
import Box from '@mui/material/Box';
import { f } from 'shared/styles';
import { Errors } from 'shared/lib/validators';
import { CustomTheme, useTheme } from 'app/providers/theme';



const useStyles = (theme: CustomTheme, sx: any) => ({
  root: {
    width: '100%',
    ...sx.root
  },
  content: {
    ...f('c-c-c'),
    width : '100%',
    gap   : 1,
    // fontSize : theme.error.fontSize,
    color : theme.palette.error.main,
    ...sx.content
  }
});


type Props = {
  field?  : string
  sx?     : any
  errors? : Errors
  all?    : boolean // Если надо вывести все ошибки
}


/** v.2025-08-28 */
export const ErrorBox: FC<Props> = memo(({ field = '', sx: styles = {}, errors = {}, all }) => {
  const { root, content } = useStyles(useTheme() as unknown as CustomTheme, styles);

  if (! errors?.[field] && ! all) return null;


  return (
    <Box data-testid='ErrorBox' sx={root}>
      <Box sx={content}>
        {
          errors?.[field]
            ? errors?.[field]
            : Object.entries(errors).map(([key, error]) => <Box key={key} component='span'>
                {error}
              </Box>
            )
        }
      </Box>
    </Box>
  )
});
