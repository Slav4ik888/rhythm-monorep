// packages/frontend/src/features/ui/ui-configurator/components/switcher-item/ui/index.tsx

import { FC, memo } from 'react';
import Switch from '@mui/material/Switch';
import { UIConfiguratorItemWrapper } from '../../ui-configurator-item-wrapper';

interface Props {
  title: string;
  checked: boolean;
  ariaLabel: string;
  onToggle: () => void;
}

export const SwitcherItem: FC<Props> = memo(({ title, checked, ariaLabel, onToggle }) => (
  <UIConfiguratorItemWrapper>
    {title}

    <Switch size='small' checked={checked} slotProps={{ input: { 'aria-label': ariaLabel } }} onChange={onToggle} />
  </UIConfiguratorItemWrapper>
));
