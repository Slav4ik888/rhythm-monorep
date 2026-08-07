
export type BorderStyleType = 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | 'none';
export const arrayBorderStyles = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset', 'none'];

export type FlexDirectionType  = 'row' | 'column' | 'row-reverse' | 'column-reverse'
export type FlexWrapType       = 'wrap' | 'nowrap'
export type AlignItemsType     = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
export type JustifyContentType = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch'

export type RgbaString = string // rgba(255, 255, 255, 1)

export interface ViewItemStyles {
  width?     : number | string // In px | '100%' | 'auto' | 'max-content' | 'min-content'
  minWidth?  : number | string
  maxWidth?  : number | string
  
  height?    : number | string // In px | '100%' | 'auto' | 'max-content' | 'min-content'
  minHeight? : number | string
  maxHeight? : number | string
  
  display?        : 'flex'
  flexDirection?  : FlexDirectionType
  flexWrap?       : FlexWrapType
  alignItems?     : AlignItemsType
  justifyContent? : JustifyContentType


  // padding - 1 === 8px
  p? : number
  px?: number
  py?: number

  pt?: number
  pr?: number
  pb?: number
  pl?: number

  // margin - 1 === 8px
  m? : number
  mx?: number
  my?: number

  mt?: number
  mr?: number
  mb?: number
  ml?: number

  // border
  borderStyle?  : BorderStyleType
  borderWidth?  : number | string // In px
  borderRadius? : number | string // In px
  borderColor?  : string

  // shadow      offset-x | offset-y | blur-radius | spread-radius | color 
  boxShadow?    : string // 1px 1px 3px 0px rgb(184 184 184);

  // background
  background?   : RgbaString // rgba(255, 255, 255, 1)

  // color
  color?        : RgbaString // rgba(255, 255, 255, 1)

  // font
  fontSize?     : string // In rem

  // fontWeight?: number
  // fontStyle?: string
  // fontFamily?: string
  // textAlign?: string
  // textDecoration?: string
  // textTransform?: string
  // textShadow?: string
  // textOutline?: string
  // textOverflow?: string
  // textWrap?: string

}

export type ItemStylesField = keyof ViewItemStyles;
