import { FC, memo } from 'react';
import Link from '@mui/material/Link';
import { LinkType } from 'app/providers/routes';
import { f, SxCard } from 'shared/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';



interface Props {
  links : LinkType[]
  sx?   : SxCard
}

/** Рендерит ссылки для навигации в Footer */
export const RenderFooterLinks: FC<Props> = memo(({ links, sx }) => {
  const getName = (name: string) => (
    <Typography
      sx={{
        color: 'text.main',
        ...sx?.label
      }}
    >
      {name}
    </Typography>
  );


  return (
    <Box
      component = 'ul'
      sx        = {{
        ...f('c-fs-fs'),
        listStyle : 'none',
        p         : 0,
        ...sx?.root
      }}
    >
      {links.map(({ route, name, href }) => (
        <Box
          key        = {name}
          component  = 'li'
          lineHeight = {1}
        >
          {
            route
              ? <NavLink to={route}>
                  {getName(name)}
                </NavLink>
              : <Link href={href} target='_blank'>
                  {getName(name)}
                </Link>
          }
        </Box>
      ))}
    </Box>
  )
});
