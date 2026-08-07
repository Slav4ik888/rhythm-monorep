import { FC, memo, MouseEvent, useCallback } from 'react';
import { pxToRem } from 'shared/styles';
import { Input } from 'shared/ui/containers';
import { CustomSettings } from 'entities/company';
import { BaseChipType } from 'entities/dashboard-view';



interface Props {
  type     : BaseChipType
  label    : string
  value    : string
  onSubmit : (data: Partial<CustomSettings>) => void
}

/**
 * Настройка произвольного названия
 * For type === 'periodType'
 */
export const SetColorsItemInputField: FC<Props> = memo(({ onSubmit, value = '', type, label }) => {
  const handleSubmit = useCallback((e: MouseEvent, title: string | number) => {
    onSubmit({
      [type]: {
        [label]: {
          title
        }
    } });
  }, [type, label, onSubmit]);


  return (
    <Input
      defaultValue = {value}
      changesValue = {value}
      toolTitle    = 'Введите название поля'
      sx           = {{ field: { height: pxToRem(40) } }}
      onBlur       = {handleSubmit}
      onChange     = {() => {}}
      onSubmit     = {handleSubmit}
    />
  )
});
