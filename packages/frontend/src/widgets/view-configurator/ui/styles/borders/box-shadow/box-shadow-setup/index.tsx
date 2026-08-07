import { FC, memo, useCallback, useMemo, } from 'react';
import { ViewItemStylesField, ViewItem } from 'entities/dashboard-view';
import { BoxShadowSetupComponent } from './component';
import { splitShadow } from './utils';



interface Props {
  field        : ViewItemStylesField
  selectedItem : ViewItem | undefined
  onChange     : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

/** box-shadow setup container */
export const BoxShadowSetupContainer: FC<Props> = memo(({ field, selectedItem, onChange }) => {
  const [oX = 1, oY = 1, bR = 3, sR = 0, clr = 'rgba(184, 184, 184, 1)'] = useMemo(() =>
    splitShadow(selectedItem?.styles?.[field]),
    [field, selectedItem]
  );

  const handleChange = useCallback((value: string | number, index: number) => {
    switch (index) {
      case 0: return onChange(field, `${value}px ${oY}px ${bR}px ${sR}px ${clr}`, 'BoxShadowSetupContainer')
      case 1: return onChange(field, `${oX}px ${value}px ${bR}px ${sR}px ${clr}`, 'BoxShadowSetupContainer')
      case 2: return onChange(field, `${oX}px ${oY}px ${value}px ${sR}px ${clr}`, 'BoxShadowSetupContainer');
      case 3: return onChange(field, `${oX}px ${oY}px ${bR}px ${value}px ${clr}`, 'BoxShadowSetupContainer');
      case 4: return onChange(field, `${oX}px ${oY}px ${bR}px ${sR}px ${value}`, 'BoxShadowSetupContainer');
      default: return undefined
    }
  },
    [field, oX, oY, bR, sR, clr, onChange]
  );


  return (
    <BoxShadowSetupComponent
      field        = {field}
      selectedItem = {selectedItem}
      color        = {clr}
      onChange     = {handleChange}
    />
  )
});
