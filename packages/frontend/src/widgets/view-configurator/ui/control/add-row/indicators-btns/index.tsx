import { FC, memo } from 'react';
import { ViewItemType } from 'entities/dashboard-view/types';
import { AddBtn } from 'shared/ui/configurators-components';



interface Props {
  onClick: (type: ViewItemType | undefined) => void
}

/** Row with view elements btns */
export const AddViewItemIndicatorsBtns: FC<Props> = memo(({ onClick }) => (
  <>
    <AddBtn
      type    = 'chart'
      onClick = {onClick}
    />
    <AddBtn
      type    = 'period'
      onClick = {onClick}
    />
    <AddBtn
      type    = 'chip'
      onClick = {onClick}
    />
    <AddBtn
      type    = 'growthIcon'
      onClick = {onClick}
    />
    <AddBtn
      type    = 'digitIndicator'
      onClick = {onClick}
    />
    <AddBtn
      type    = 'gaugeColumn'
      onClick = {onClick}
    />
    <AddBtn
      type    = 'list'
      onClick = {onClick}
    />
  </>
));
