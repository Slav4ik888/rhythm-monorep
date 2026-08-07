import { FC, memo } from 'react';
import { RowWrapperTitle } from 'shared/ui/configurators-components';
import { FlagByScheme } from '../..';



interface Props {
  scheme       : string // начиная с 1го уровня
  title        : string
  boldTitle?   : boolean
  toolTitle    : string
  sx?          : any
}

export const RowFlagByScheme: FC<Props> = memo(({ boldTitle, scheme, title, toolTitle, sx }) => (
  <RowWrapperTitle
    title     = {title}
    boldTitle = {boldTitle}
    toolTitle = {toolTitle}
    sx        = {sx}
  >
    <FlagByScheme
      scheme       = {scheme}
      title        = {title}
      toolTitle    = {toolTitle}
    />
  </RowWrapperTitle>
));
