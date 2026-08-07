
export interface GaugeColumnItem {
  label?     : string
  color?     : string
  // Значение, когда должен быть сработать этот параметр и включится этот цвет
  valueMore? : number | string // >= | string при очистке присваивается ''
  valueLess? : number | string // <  | string при очистке присваивается ''
}
