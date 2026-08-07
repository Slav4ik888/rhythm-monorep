import { BorderStyleType, RgbaString, stylesToSx } from 'entities/dashboard-view';
import { isNotUndefined as is } from 'shared/lib/validators';



interface Styles {
  activeP?                       : number
  activePx?                      : number
  activePy?                      : number

  activePt?                      : number
  activePr?                      : number
  activePb?                      : number
  activePl?                      : number

  activeColor?                   : RgbaString
  activeBackground?              : RgbaString
  activeFontWeight?              : number
  activeBorderStyle?             : BorderStyleType
  activeBorderWidth?             : number | string
  activeBorderRadius?            : number | string
  activeBorderTopLeftRadius?     : number | string
  activeBorderTopRightRadius?    : number | string
  activeBorderBottomLeftRadius?  : number | string
  activeBorderBottomRightRadius? : number | string
  activeBorderColor?             : string
  activeBoxShadow?               : string
}

export const getStyles = ({
  activeP, activePx, activePy, activePt, activePr, activePb, activePl,
  activeColor, activeBackground, activeFontWeight, activeBorderStyle, activeBorderWidth,
  activeBorderRadius, activeBorderColor, activeBoxShadow, activeBorderTopLeftRadius,
  activeBorderTopRightRadius, activeBorderBottomLeftRadius, activeBorderBottomRightRadius
}: Styles) => {
  const root: any = {};

  // Padding
  if (is(activeP)) {
    root.p = stylesToSx({ p: activeP }).p;
  }
  if (is(activePx)) {
    root.px = stylesToSx({ px: activePx }).px;
  }
  if (is(activePy)) {
    root.py = stylesToSx({ py: activePy }).py;
  }
  if (is(activePt)) {
    root.pt = stylesToSx({ pt: activePt }).pt;
  }
  if (is(activePb)) {
    root.pb = stylesToSx({ pb: activePb }).pb;
  }
  if (is(activePl)) {
    root.pl = stylesToSx({ pl: activePl }).pl;
  }
  if (is(activePr)) {
    root.pr = stylesToSx({ pr: activePr }).pr;
  }

  // Text
  if (is(activeColor)) {
    root.color = activeColor
  }
  if (is(activeBackground)) {
    root.background = activeBackground
  }
  if (is(activeFontWeight)) {
    root.fontWeight = activeFontWeight
  }

  // Border
  if (is(activeBorderStyle)) {
    root.borderStyle = activeBorderStyle
  }
  if (is(activeBorderWidth)) {
    root.borderWidth = stylesToSx({ borderWidth: activeBorderWidth }).borderWidth;
  }
  if (is(activeBorderColor)) {
    root.borderColor = activeBorderColor
  }

  // Border-radius
  if (is(activeBorderRadius)) {
    root.borderRadius = stylesToSx({ borderRadius: activeBorderRadius }).borderRadius;
  }
  if (is(activeBorderTopLeftRadius)) {
    root.borderTopLeftRadius = stylesToSx({ borderTopLeftRadius: activeBorderTopLeftRadius })
      .borderTopLeftRadius;
  }
  if (is(activeBorderTopRightRadius)) {
    root.borderTopRightRadius = stylesToSx({ borderTopRightRadius: activeBorderTopRightRadius })
      .borderTopRightRadius;
  }
  if (is(activeBorderBottomLeftRadius)) {
    root.borderBottomLeftRadius = stylesToSx({ borderBottomLeftRadius: activeBorderBottomLeftRadius })
      .borderBottomLeftRadius;
  }
  if (is(activeBorderBottomRightRadius)) {
    root.borderBottomRightRadius = stylesToSx({ borderBottomRightRadius: activeBorderBottomRightRadius })
      .borderBottomRightRadius;
  }

  // Box-shadow
  if (is(activeBoxShadow)) {
    root.boxShadow = activeBoxShadow
  }

  return {
    ...root
  }
};
