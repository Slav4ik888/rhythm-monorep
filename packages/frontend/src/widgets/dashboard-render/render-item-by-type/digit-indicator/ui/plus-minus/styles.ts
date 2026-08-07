import { stylesToSx } from 'entities/dashboard-view';



interface Styles {
  fontSize   : number | undefined
  lineHeight : number | undefined
  color      : string
}

export const getStyles = ({ fontSize, lineHeight, color }: Styles) => {
  const root: any = {};

  // Не все стили, тк ширина и подобное нужно только для главного элемента
  if (fontSize)   root.fontSize   = stylesToSx({ fontSize })?.fontSize;
  if (lineHeight) root.lineHeight = stylesToSx({ lineHeight })?.lineHeight;

  return {
    cursor: 'default',
    ...root,
    color,
  }
};
