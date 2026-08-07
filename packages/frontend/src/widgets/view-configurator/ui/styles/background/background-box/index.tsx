import { FC, memo } from 'react';
import { ConfiguratorSubHeader as SubHeader } from 'shared/ui/configurators-components';
import { ViewItem, ViewItemStylesField } from 'entities/dashboard-view';
import { SetBackground } from '../set-background';



interface Props {
  selectedItem : ViewItem | undefined
  onChange     : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

/** Фон */
export const BackgroundBox: FC<Props> = memo(({ selectedItem, onChange }) => (
  <SubHeader title='Фон'>
    <SetBackground
      field        = 'background'
      selectedItem = {selectedItem}
      onChange     = {onChange}
    />
    {/* opacity */}
  </SubHeader>
));
