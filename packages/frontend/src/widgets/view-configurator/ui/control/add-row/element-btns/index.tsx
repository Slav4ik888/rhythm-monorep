import { FC, memo } from 'react';
import { ViewItemType } from 'entities/dashboard-view/types';
import { AddBtn } from 'shared/ui/configurators-components';



interface Props {
  onClick: (type: ViewItemType | undefined) => void
}

/** Row with chart elements btns */
export const AddViewItemElementBtns: FC<Props> = memo(({ onClick }) => (
  <>
    <AddBtn
      type    = 'box'
      onClick = {onClick}
    />
    <AddBtn
      type    = 'text'
      onClick = {onClick}
    />
    <AddBtn
      type    = 'icon'
      onClick = {onClick}
    />
    <AddBtn
      type    = 'divider'
      onClick = {onClick}
    />
  </>
));
