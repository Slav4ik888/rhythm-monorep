import { FC, memo } from 'react';
import { AddRows } from './add-row';
import { DangerZone } from './danger-zone';
import { MovementRow } from './movement-row';
import { SwitchRow } from './switch-row';



/** Вкладка Control */
export const ViewItemControlConfigurator: FC = memo(() => (
    <>
      <SwitchRow />
      <MovementRow />
      <AddRows />
      {/* DisplayShow - показать/скрыть элемент, "скрытый" - показывается только в режиме редактирования */}
      <DangerZone />
    </>
  ));
