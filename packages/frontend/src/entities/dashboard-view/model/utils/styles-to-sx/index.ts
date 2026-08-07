import { isNum } from 'shared/lib/validators';
import { ViewItemStyles } from '../../../types';
import { is } from './is';



const getDimensions = (dim: any) => isNum(dim) ? `${dim}px` : dim;
const getIndents = (v: any) => v ? v / 8 : v;

const isEmptyStr = (v: any) => v === '';

/**
 * Base format styles transform to sx
 *
 * DB => sx
 *
 * DB => display user
 */
export const stylesToSx = (style?: ViewItemStyles): any => {
  const sx = { ...style } as any;

  if (! style) return sx;

  const {
    gap, rowGap, columnGap,
    width, minWidth, maxWidth, height, minHeight, maxHeight,
    borderWidth,
    borderRadius, borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius,
    fontSize, dirFontSize,
    p, px, py, pt, pb, pr, pl,
    m, mx, my, mt, mb, mr, ml,
   } = style;

  // gaps
  if (is(gap))       sx.gap       = getDimensions(gap);
  if (is(rowGap))    sx.rowGap    = getDimensions(rowGap);
  if (is(columnGap)) sx.columnGap = getDimensions(columnGap);

  // width
  if (is(width))    sx.width    = getDimensions(width);
  if (is(minWidth)) sx.minWidth = getDimensions(minWidth);
  if (is(maxWidth)) sx.maxWidth = getDimensions(maxWidth);

  // height
  if (is(height))    sx.height    = getDimensions(height);
  if (is(minHeight)) sx.minHeight = getDimensions(minHeight);
  if (is(maxHeight)) sx.maxHeight = getDimensions(maxHeight);

  // paddings
  if (is(p))          sx.p  = getIndents(p);
  if (isEmptyStr(p))  sx.p  = null;

  if (is(py))         sx.py = getIndents(py);
  if (isEmptyStr(py)) sx.py = null;

  if (is(px))         sx.px = getIndents(px);
  if (isEmptyStr(px)) sx.px = null;

  if (is(pt))         sx.pt = getIndents(pt);
  if (isEmptyStr(pt)) sx.pt = null;

  if (is(pr))         sx.pr = getIndents(pr);
  if (isEmptyStr(pr)) sx.pr = null;

  if (is(pb))         sx.pb = getIndents(pb);
  if (isEmptyStr(pb)) sx.pb = null;

  if (is(pl))         sx.pl = getIndents(pl);
  if (isEmptyStr(pl)) sx.pl = null;

  // margins
  if (is(m))          sx.m  = getIndents(m);
  if (isEmptyStr(m))  sx.m  = null;

  if (is(my))         sx.my = getIndents(my);
  if (isEmptyStr(my)) sx.my = null;

  if (is(mx))         sx.mx = getIndents(mx);
  if (isEmptyStr(mx)) sx.mx = null;

  if (is(mt))         sx.mt = getIndents(mt);
  if (isEmptyStr(mt)) sx.mt = null;

  if (is(mr))         sx.mr = getIndents(mr);
  if (isEmptyStr(mr)) sx.mr = null;

  if (is(mb))         sx.mb = getIndents(mb);
  if (isEmptyStr(mb)) sx.mb = null;

  if (is(ml))         sx.ml = getIndents(ml);
  if (isEmptyStr(ml)) sx.ml = null;

  // borders
  if (is(borderWidth))             sx.borderWidth             = `${borderWidth}px`;
  if (is(borderRadius))            sx.borderRadius            = `${borderRadius}px`;
  if (is(borderTopLeftRadius))     sx.borderTopLeftRadius     = `${borderTopLeftRadius}px`;
  if (is(borderTopRightRadius))    sx.borderTopRightRadius    = `${borderTopRightRadius}px`;
  if (is(borderBottomLeftRadius))  sx.borderBottomLeftRadius  = `${borderBottomLeftRadius}px`;
  if (is(borderBottomRightRadius)) sx.borderBottomRightRadius = `${borderBottomRightRadius}px`;

  // font-size
  if (is(fontSize))    sx.fontSize    = `${fontSize}px`;
  if (is(dirFontSize)) sx.dirFontSize = `${dirFontSize}px`;

  return sx
}
