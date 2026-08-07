import { FC, memo } from 'react';
import { SelectIcon } from './select-icon';
import { DefaultIconId } from 'shared/lib/icons';



interface Props {
  selectedIconId : DefaultIconId | null
  onSelectIcon   : (iconId: DefaultIconId) => void
}

export const SelectIconContainer: FC<Props> = memo(({ selectedIconId, onSelectIcon }) => (
  <SelectIcon
    selectedIconId = {selectedIconId}
    onSelect       = {onSelectIcon}
  />
));
