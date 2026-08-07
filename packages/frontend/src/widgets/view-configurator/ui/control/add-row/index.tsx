import { FC, memo } from 'react';
import { RowWrapper, ConfiguratorSubHeader as SubHeader } from 'shared/ui/configurators-components';
import { useDashboardViewState } from 'entities/dashboard-view';
import { AddNewViewItem } from 'features/dashboard-view';
import { f, pxToRem } from 'shared/styles';
import { AddViewItemElementBtns } from './element-btns';
import { AddViewItemIndicatorsBtns } from './indicators-btns';
import { OpenTemplatesBtn } from 'widgets/dashboard-templates';



/** Строки для добавления разных элементов */
export const AddRows: FC = memo(() => {
  const { selectedId, selectedItem: { type } } = useDashboardViewState();

  if (type !== 'box') return null

  return (
    <SubHeader title='Добавление элементов'>
      <RowWrapper sx={{ root: { ...f('-c-fe-w'), gap: pxToRem(8) } }}>
        <AddNewViewItem parentId={selectedId} component={AddViewItemElementBtns} />
      </RowWrapper>

      <RowWrapper sx={{ root: { ...f('-c-fe-w'), gap: pxToRem(8) } }}>
        {/* TODO: select chart type: line | bar ... */}
        <AddNewViewItem parentId={selectedId} component={AddViewItemIndicatorsBtns} />
      </RowWrapper>

      <RowWrapper sx={{ root: { ...f('-c-fe-w'), gap: pxToRem(8) } }}>
        <OpenTemplatesBtn />
      </RowWrapper>
    </SubHeader>
  )
});
