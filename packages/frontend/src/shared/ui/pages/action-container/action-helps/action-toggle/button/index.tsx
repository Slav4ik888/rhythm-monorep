import { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { AppRoutes, RoutePath } from 'app/providers/routes';
import { useTheme } from 'app/providers/theme';
import Box from '@mui/material/Box';



interface Props {
  text     : string
  link     : AppRoutes
  linkText : string
}

export const ActionToggleButton: FC<Props> = memo(({ text, link, linkText }) => {
  const theme = useTheme();

  return (
    <Typography variant='body2'>
      {text}
      <Link to={RoutePath[link]}>
        <Box
          component = 'span'
          sx        = {{
            color          : theme.palette.secondary.main,
            textDecoration : 'underline',

            '&:hover': {
              textDecoration: 'none',
            }
          }}
        >
          &nbsp;{linkText}
        </Box>
      </Link>
    </Typography>
  )
});
