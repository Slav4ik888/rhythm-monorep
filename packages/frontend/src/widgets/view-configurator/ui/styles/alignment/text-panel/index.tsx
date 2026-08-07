import { FC, memo } from 'react';
import { RowWrapper } from 'shared/ui/configurators-components';
import { ViewItem, ViewItemStylesField } from 'entities/dashboard-view';
import { f } from 'shared/styles';
import { TextAlignment } from './text-alignment';



interface Props {
  selectedItem : ViewItem | undefined
  onChange     : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

export const TextPanelAlignment: FC<Props> = memo(({ selectedItem, onChange }) => (
    <RowWrapper sx={{ root: { ...f('--fe') } }}>
      <TextAlignment
        value    = {selectedItem?.styles?.textAlign}
        onChange = {onChange}
      />
    </RowWrapper>
  ));
