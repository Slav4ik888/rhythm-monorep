import { FC, memo } from 'react';
import { ViewItem, ViewItemStylesField } from 'entities/dashboard-view';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';
import { SelectTextWrap } from './select-text-wrap';



interface Props {
  selectedItem : ViewItem | undefined
  onChange     : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

/** Set textWrap */
export const TextWrapRow: FC<Props> = memo(({ selectedItem, onChange }) => (
  <RowWrapper>
    <ConfiguratorTextTitle title='text-wrap' toolTitle='text-wrap' bold />
    <SelectTextWrap selectedItem={selectedItem} onChange={onChange} />
  </RowWrapper>
));
