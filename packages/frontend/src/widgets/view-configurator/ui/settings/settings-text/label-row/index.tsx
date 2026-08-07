import { FC, memo } from 'react';
import { useDashboardViewState } from 'entities/dashboard-view';
import { RowInputByScheme } from '../../../base-features-components';
import { pxToRem } from 'shared/styles';



export const LabelRow: FC = memo(() => {
  const { selectedItem } = useDashboardViewState();

  return (
    <RowInputByScheme
      scheme       = 'label'
      title        = 'Заголовок'
      toolTitle    = 'Заголовок'
      width        = '100%'
      selectedItem = {selectedItem}
      sx           = {{
        input: {
          height    : pxToRem(32),
          textAlign : 'left',
          padding   : '2px 4px 2px 8px',
        }
      }}
      onChange     = {() => { }} // Чтобы при вводе текста не происходило обновления
    />
  )
});
