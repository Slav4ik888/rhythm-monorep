import { ColorName } from 'app/providers/theme';
import { FC, memo } from 'react';
import MDTypography from 'shared/ui/mui-design-components/md-typography';



interface Props {
  textColor : ColorName
  title     : string
}


export const SidebarTitle: FC<Props> = memo(({ textColor, title }) => (
  <MDTypography
    color         = {textColor}
    display       = 'block'
    variant       = 'caption'
    fontWeight    = 'bold'
    textTransform = 'uppercase'
    pl            = {3}
    mt            = {2}
    mb            = {1}
    ml            = {1}
  >
    {title}
  </MDTypography>
));

