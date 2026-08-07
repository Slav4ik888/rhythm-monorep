import { FC, memo } from 'react';
import Link from '@mui/material/Link';
import { SidebarCollapse } from '../sidebar-collapse';



interface Props {
  href        : string
  title       : string
  active      : boolean // текущий активный sheetId
  icon        : MuiIcon | string
  noCollapse? : boolean
}

export const SidebarLink: FC<Props> = memo(({ href, active, noCollapse, icon, title }) => (
  <Link
    href   = {href}
    target = '_blank'
    rel    = 'noreferrer'
    sx     = {{ textDecoration: 'none' }}
  >
    <SidebarCollapse
      title      = {title}
      icon       = {icon}
      active     = {active}
      noCollapse = {noCollapse}
    />
  </Link>
));
