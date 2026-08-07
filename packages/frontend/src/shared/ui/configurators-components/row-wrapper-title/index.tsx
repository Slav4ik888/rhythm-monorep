import { FC, memo, ReactNode } from 'react';
import { ConfiguratorTextTitle, RowWrapper } from '../../configurators-components';
import { SxCard } from '../../../styles';



interface Props {
  boldTitle?  : boolean
  title       : string
  toolTitle   : string
  children    : ReactNode
  sx?         : SxCard
}

export const RowWrapperTitle: FC<Props> = memo(({ children, title, toolTitle, sx, boldTitle = true }) => (
  <RowWrapper sx={sx}>
    <ConfiguratorTextTitle
      bold      = {boldTitle}
      title     = {title}
      toolTitle = {toolTitle}
      sx        = {sx}
    />
    {children}
  </RowWrapper>
));
