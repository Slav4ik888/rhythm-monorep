import { FC, memo } from 'react';
import { ViewItem } from 'entities/dashboard-view';
import { ItemDigitIndicatorValue as Value } from '../value';
import { ItemDigitIndicatorEnding as Ending } from '../ending';
import { ItemDigitIndicatorPlusMinus as PlusMinus } from '../plus-minus';
import { ItemDigitIndicatorReduction as Reduction } from '../reduction';
import { Increased } from 'entities/dashboard-data';



interface Props {
  item      : ViewItem
  increased : Increased
  color     : string
  value     : string
  reduction : string
}

/** Item digitIndicator */
export const ItemDigitIndicatorComponent: FC<Props> = memo(({ item, increased, color, value, reduction }) => (
  <>
    {/* +/- */}
    {item?.settings?.plusMinus && (
      <PlusMinus
        item       = {item}
        fontSize   = {item?.styles?.fontSize}
        lineHeight = {item?.styles?.lineHeight}
        increased  = {increased}
        color      = {color}
      />
    )}
    {/* Число */}
    <Value
      styles = {item?.styles}
      value  = {value}
      color  = {color}
      // kod    = {item?.settings?.kod}
    />

    {/* Сокращение - (тыс млн) */}
    {reduction && (
      <Reduction
        dirFontSize   = {item?.styles?.dirFontSize}
        fontSize      = {item?.styles?.fontSize}
        dirFontWeight = {item?.styles?.dirFontWeight}
        fontWeight    = {item?.styles?.fontWeight}
        lineHeight    = {item?.styles?.lineHeight}
        reduction     = {reduction}
        color         = {color}
      />
    )}
    {/* Ед изменения */}
    {item?.settings?.endingType && item?.settings?.endingType !== '-' && (
      <Ending
        dirFontSize   = {item?.styles?.dirFontSize}
        fontSize      = {item?.styles?.fontSize}
        dirFontWeight = {item?.styles?.dirFontWeight}
        fontWeight    = {item?.styles?.fontWeight}
        lineHeight    = {item?.styles?.lineHeight}
        endingType    = {item?.settings?.endingType}
        color         = {color}
      />
    )}
  </>
));
