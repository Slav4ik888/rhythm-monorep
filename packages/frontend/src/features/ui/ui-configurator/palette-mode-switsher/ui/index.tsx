import { FC, memo } from 'react';
import { useUIConfiguratorController } from 'app/providers/theme';
import { PaletteModeSwitcherRowComponent } from './switcher-row';
import { PaletteModeSwitcherIconComponent } from './switcher-icon';



interface Props {
  ui?  : boolean // Toggle row, for ui-configurator
}

export const PaletteModeSwitcher: FC<Props> = memo(({ ui }) => {
  const [configuratorState, dispatch] = useUIConfiguratorController();
  const { mode } = configuratorState;

  return (
    <>
      {
        ui
          ? <PaletteModeSwitcherRowComponent mode={mode} dispatch={dispatch} />
          : <PaletteModeSwitcherIconComponent mode={mode} dispatch={dispatch} />
      }
    </>
  )
});
