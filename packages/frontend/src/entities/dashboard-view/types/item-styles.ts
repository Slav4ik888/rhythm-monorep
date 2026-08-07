/* eslint-disable */
// v.2025-07-08
export type BorderStyleType    =  'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | 'none';
export type FlexDirectionType  = 'row' | 'column' | 'row-reverse' | 'column-reverse'
export type FlexWrapType       = 'wrap' | 'nowrap' | 'wrap-reverse'
export type AlignItemsType     = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
export type JustifyContentType = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch'

export type RgbaString         = string // rgba(255, 255, 255, 1)
export type FontStyleType      =  'normal' | 'italic'
export type FontWeightType     =  'lighter' | 'normal' | 'bold' | 'bolder' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
export type TextWrapType       =  'balance' | 'auto' | 'inherit'

export type TextAlignType = 'left' | 'right' | 'center';


// v.2025-08-11
export interface ViewItemStyles {
  width?                         : number | string // In px | '100%' | 'auto' | 'max-content' | 'min-content'
  minWidth?                      : number | string
  maxWidth?                      : number | string

  height?                        : number | string // In px | '100%' | 'auto' | 'max-content' | 'min-content'
  minHeight?                     : number | string
  maxHeight?                     : number | string

  display?                       : 'flex'
  flexDirection?                 : FlexDirectionType
  flexWrap?                      : FlexWrapType
  alignItems?                    : AlignItemsType
  justifyContent?                : JustifyContentType

  gap?                           : number | string
  rowGap?                        : number | string
  columnGap?                     : number | string

  overflow?                      : 'hidden' | 'scroll' | 'auto'

  // padding - 1 === 8px
  p?                             : number
  px?                            : number
  py?                            : number

  pt?                            : number
  pr?                            : number
  pb?                            : number
  pl?                            : number

  // margin - 1 === 8px
  m?                             : number
  mx?                            : number
  my?                            : number

  mt?                            : number
  mr?                            : number
  mb?                            : number
  ml?                            : number

  // border
  borderStyle?                   : BorderStyleType
  borderWidth?                   : number | string // In px

  borderRadius?                  : number | string // In px
  borderTopLeftRadius?           : number | string
  borderTopRightRadius?          : number | string
  borderBottomLeftRadius?        : number | string
  borderBottomRightRadius?       : number | string

  borderColor?                   : string

  // shadow      offset-x | offset-y | blur-radius | spread-radius | color
  boxShadow?                     : string // 1px 1px 3px 0px rgb(184 184 184);

  // color
  color?                         : RgbaString // rgba(255, 255, 255, 1)

  // background
  background?                    : RgbaString // rgba(255, 255, 255, 1)

  // font
  fontSize?                      : number // In rem
  fontWeight?                    : number
  fontStyle?                     : FontStyleType
  fontFamily?                    : string
  lineHeight?                    : number

  textAlign?                     : TextAlignType
  textWrap?                      : TextWrapType
  // textDecoration?: string
  // textTransform?: string
  // textShadow?: string
  // textOutline?: string
  // textOverflow?: string
  // textWrap?: string


  // digitIndicators
  //  - font
  //    - reduction
  dirFontSize?                   : number // In rem
  dirFontWeight?                 : number
  //    - ending


  // In Period Active
  activeP?                       : number
  activePx?                      : number
  activePy?                      : number

  activePt?                      : number
  activePr?                      : number
  activePb?                      : number
  activePl?                      : number

  activeColor?                   : RgbaString
  activeBackground?              : RgbaString

  activeFontStyle?               : FontStyleType
  activeFontWeight?              : number

  activeBorderStyle?             : BorderStyleType
  activeBorderWidth?             : number | string

  activeBorderRadius?            : number | string
  activeBorderTopLeftRadius?     : number | string
  activeBorderTopRightRadius?    : number | string
  activeBorderBottomLeftRadius?  : number | string
  activeBorderBottomRightRadius? : number | string

  activeBorderColor?             : string
  activeBoxShadow?               : string // 1px 1px 3px 0px rgb(184 184 184);

  // Icon
  iconColor?                     : RgbaString
}

export type ViewItemStylesField = keyof ViewItemStyles;
