import { FC, memo } from 'react';
import { RowWrapper } from 'shared/ui/configurators-components';
import {
  FlexDirectionType, AlignItemsType, ViewItemStylesField, JustifyContentType, ViewItem, FlexWrapType
} from 'entities/dashboard-view';
import { FlexDirection } from './flex-direction';
import { AlignItems } from './align-items';
import { JustifyContent } from './justify-content';
import Stack from '@mui/material/Stack';
import { f } from 'shared/styles';
import { FlexWrap } from './flex-wrap';



interface Props {
  selectedItem : ViewItem | undefined
  onChange     : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

export const FlexPanelAlignment: FC<Props> = memo(({ selectedItem, onChange }) => (
    <RowWrapper sx={{ root: { ...f('c-fs-sb'), gap: 1 } }}>
      <Stack direction='row' spacing={1} justifyContent='space-between' width='100%'>
        <FlexDirection
          value    = {selectedItem?.styles?.flexDirection as FlexDirectionType}
          onChange = {onChange}
        />
        <FlexWrap
          value    = {selectedItem?.styles?.flexWrap as FlexWrapType}
          onChange = {onChange}
        />
      </Stack>


      <Stack spacing={1} alignItems='flex-end' width='100%'>
        <AlignItems
          value    = {selectedItem?.styles?.alignItems as AlignItemsType}
          onChange = {onChange}
        />
        <JustifyContent
          value    = {selectedItem?.styles?.justifyContent as JustifyContentType}
          onChange = {onChange}
        />
      </Stack>
    </RowWrapper>
  ));
