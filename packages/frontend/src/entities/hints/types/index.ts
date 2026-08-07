
export interface Position {
  top            : number
  left           : number
  arrowPosition  : 'none' | 'top' | 'bottom' | 'left' | 'right'
  elementVisible : boolean
  score?         : number
  arrowOffset?   : number // Смещение стрелки
}

/** Подсказка */
export interface Hint {
  id         : string  // Id of the element to which the hint is attached
  title      : string  // Краткое название
  text       : string  // Text to display
  attention? : string  // Attention text
  isShown    : boolean // В этой сессии уже показана эта подсказка
  showAgain  : boolean // Показывать снова от дальнейшего показа этой подсказки - храниться у пользователя
}
