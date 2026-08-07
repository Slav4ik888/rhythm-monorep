import { isNotUndefined as is, isStr } from 'shared/lib/validators';
import { ViewItemStyles } from '../../../types';



/** Содержит ли строка символы 'px' */
const isPx = (str: any): boolean => isStr(str) && /px/.test(str);

/** Убирает из строки символы 'px' */
const removePx = (str: string): string => str.replace(/px/g, '');

const getDimensions = (dim: any) => isPx(dim) ? `${dim}px` : dim;
const getIndents = (v: any) => v * 8;


/**
 * Sx transform to base format styles
 * Пока НЕ используется
 */
export const sxToStyles = (sx?: ViewItemStyles): ViewItemStyles => {
  const style = { ...sx };

  if (! sx) return style;

  const {
    width, minWidth, maxWidth, height, minHeight, maxHeight,
    p, px, py, pt, pb, pr, pl,
    m, mx, my, mt, mb, mr, ml,
  } = sx;

  // width
  if (width)    style.width    = getDimensions(width);
  if (minWidth) style.minWidth = getDimensions(minWidth);
  if (maxWidth) style.maxWidth = getDimensions(maxWidth);

  // height
  if (height)    style.height    = getDimensions(height);
  if (minHeight) style.minHeight = getDimensions(minHeight);
  if (maxHeight) style.maxHeight = getDimensions(maxHeight);

  // paddings
  if (is(p))  sx.p  = getIndents(p);
  if (is(py)) sx.py = getIndents(py);
  if (is(px)) sx.px = getIndents(px);
  if (is(pt)) sx.pt = getIndents(pt);
  if (is(pr)) sx.pr = getIndents(pr);
  if (is(pb)) sx.pb = getIndents(pb);
  if (is(pl)) sx.pl = getIndents(pl);

  // margins
  if (is(m))  sx.m  = getIndents(m);
  if (is(my)) sx.my = getIndents(my);
  if (is(mx)) sx.mx = getIndents(mx);
  if (is(mt)) sx.mt = getIndents(mt);
  if (is(mr)) sx.mr = getIndents(mr);
  if (is(mb)) sx.mb = getIndents(mb);
  if (is(ml)) sx.ml = getIndents(ml);



  // if (style.color) sx.color = style.color;
  // if (style.background) sx.background = style.background;
  // if (style.fontSize) sx.fontSize = style.fontSize;


  return sx
}
