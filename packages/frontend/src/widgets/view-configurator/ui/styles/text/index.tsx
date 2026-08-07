import { FC, memo } from 'react';
import {
  ConfiguratorSubHeader as SubHeader, ConfiguratorSubHeaderActive as SubHeaderActive
} from 'shared/ui/configurators-components';
import { ViewItemStylesField, ViewItem } from 'entities/dashboard-view';
import { SetColor } from './set-color';
import { FontSizeRow } from './font-size-row';
import { FontWeightRow } from './font-weight-row';
import { FontStyleRow } from './font-style-row';
import { LineHeightRow } from './line-height-row';
import { TextWrapRow } from './text-wrap-row';



interface Props {
  selectedItem : ViewItem | undefined
  onChange     : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

/** Card text label */
export const TextBox: FC<Props> = memo(({ selectedItem, onChange }) => (
  <>
    <SubHeader title='Текст'>
      <FontSizeRow
        scheme       = 'styles.fontSize'
        selectedItem = {selectedItem}
      />
      <FontStyleRow
        field        = 'fontStyle'
        selectedItem = {selectedItem}
        onChange     = {onChange}
      />
      <FontWeightRow scheme='styles.fontWeight' />
      <LineHeightRow selectedItem={selectedItem} />
      {/* font-family */}
      <TextWrapRow
        selectedItem = {selectedItem}
        onChange     = {onChange}
      />
      <SetColor field='color' />
    </SubHeader>

    {
      selectedItem?.type === 'digitIndicator' && (
        <SubHeaderActive title='Сокращение - (тыс | млн)'>
          <FontSizeRow
            scheme='styles.dirFontSize'
            selectedItem={selectedItem}
          />
          <FontWeightRow scheme='styles.dirFontWeight' />
        </SubHeaderActive>
      )
    }
  </>
));
