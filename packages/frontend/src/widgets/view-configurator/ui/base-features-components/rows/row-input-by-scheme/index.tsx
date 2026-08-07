import { FC, memo, MouseEvent } from 'react';
import { ViewItem } from 'entities/dashboard-view';
import { RowWrapperTitle } from 'shared/ui/configurators-components';
import { InputType } from 'shared/ui/containers';
import { InputByScheme } from '../..';
import { SxCard } from 'shared/styles';



interface Props {
  selectedItem : ViewItem | undefined
  scheme       : string // начиная с 1го уровня
  type?        : InputType
  title        : string
  toolTitle    : string
  width?       : string
  clear?       : any    // Если нужно, чтобы при очистке значения, была не пустая строка '', а что-то другое
  sx?          : SxCard
  transform?   : (v: string | number) => string | number // Если полученное начальное значение нужно как-либо преобразовать. Например, 'boxShadow': 'rgba(184, 184, 184, 1)'
  onChange?    : (e: MouseEvent, v: string | number) => void // Если нужна не стандартная обработка
  onSubmit?    : (e: MouseEvent, v: string | number) => void // Если нужна не стандартная обработка
}

export const RowInputByScheme: FC<Props> = memo(({
  selectedItem, scheme, type, title, toolTitle, width, clear, sx, transform, onChange, onSubmit
}) => (
  <RowWrapperTitle title={title} toolTitle={toolTitle} sx={sx}>
    <InputByScheme
      type         = {type}
      scheme       = {scheme}
      width        = {width}
      clear        = {clear}
      selectedItem = {selectedItem}
      sx           = {sx}
      transform    = {transform}
      onChange     = {onChange}
      onSubmit     = {onSubmit}
    />
  </RowWrapperTitle>
));
