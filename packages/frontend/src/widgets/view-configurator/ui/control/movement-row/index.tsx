import { FC, memo } from 'react';
import { RowWrapper, ConfiguratorSubHeader as SubHeader } from 'shared/ui/configurators-components';
import { useDashboardViewState } from 'entities/dashboard-view';
import { MoveToAnotherItem, MoveItemUpdownward, CopyViewItem, MoveToNewItem } from 'features/dashboard-view';
import { f, pxToRem } from 'shared/styles';
import { CopyToTemplatesBtn } from 'features/dashboard-templates';

export const MovementRow: FC = memo(() => {
  const { selectedItem } = useDashboardViewState();

  return (
    <SubHeader title='Перемещение'>
      <RowWrapper sx={{ root: { ...f('-c-fe'), gap: pxToRem(8) } }}>
        <MoveToAnotherItem />
        <MoveToNewItem />
      </RowWrapper>

      <RowWrapper sx={{ root: { ...f('-c-fe'), gap: pxToRem(8) } }}>
        <MoveItemUpdownward viewItem={selectedItem} />
        <CopyViewItem type={'copyItemFirstOnly' as any} />
        <CopyViewItem type={'copyItemsAll' as any} />
      </RowWrapper>

      <RowWrapper sx={{ root: { ...f('-c-fe'), gap: pxToRem(8) } }}>
        <CopyToTemplatesBtn type={'copyItemFirstOnly' as any} />
        <CopyToTemplatesBtn type={'copyItemsAll' as any} />
      </RowWrapper>
    </SubHeader>
  );
});
