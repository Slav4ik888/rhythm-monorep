import { stylesToSx } from 'entities/dashboard-view';
import { isNotUndefined as is } from 'shared/lib/validators';



interface Styles {
  dirFontSize   : number | undefined
  fontSize      : number | undefined
  dirFontWeight : number | undefined
  fontWeight    : number | undefined
  lineHeight    : number | undefined
  color         : string
}

export const getStyles = ({ dirFontSize, fontSize, dirFontWeight, fontWeight, lineHeight, color  }: Styles) => {
  const root: any = {};

  // TODO: разделить стили отдельно reduction отдельно ending

  // Font size
  if (is(dirFontSize) || is(fontSize)) {
    root.fontSize = is(dirFontSize)
      ? stylesToSx({ dirFontSize })?.dirFontSize
      : stylesToSx({ fontSize })?.fontSize;
  }
  // Font weight
  if (is(dirFontWeight) || is(fontWeight)) {
    root.fontWeight = is(dirFontWeight)
      ? dirFontWeight
      : fontWeight;
  }
  // Line height
  if (lineHeight) root.lineHeight = stylesToSx({ lineHeight })?.lineHeight;

  return {
    cursor: 'default',
    ...root,
    color,
    ml: 0.3,
  }
};
