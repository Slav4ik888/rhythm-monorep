import { FC, memo } from 'react';
import { ViewItem } from 'entities/dashboard-view';
import { RowWrapperTitle } from 'shared/ui/configurators-components';
import { SxCard } from 'shared/styles';
import { ColorByScheme } from '../../by-scheme/color-by-scheme';



interface Props {
  selectedItem : ViewItem | undefined
  scheme       : string // начиная с 1го уровня
  title        : string
  toolTitle    : string
  sx?          : SxCard
}

export const RowColorByScheme: FC<Props> = memo(({ selectedItem, scheme, title, toolTitle, sx }) => (
  <RowWrapperTitle title={title} toolTitle={toolTitle} sx={sx}>
    <ColorByScheme
      scheme       = {scheme}
      selectedItem = {selectedItem}
      sx           = {sx}
    />
  </RowWrapperTitle>
));
