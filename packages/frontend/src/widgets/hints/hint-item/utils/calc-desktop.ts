/* eslint-disable prefer-const */
import { Position, DEFAULT_POSITION } from 'entities/hints';
import { calculateArrowOffset } from './calc-arraow-offset';


const adjustPositionToViewport = (
  targetId       : string,
  position       : Position,
  hintRect       : DOMRect | undefined,
  viewportWidth  : number,
  viewportHeight : number
): Position => {
  if (! hintRect) {
    return DEFAULT_POSITION; // Return a default position if either rect is undefined
  }
  let { top, left, arrowPosition, elementVisible, arrowOffset } = position;
  const padding = 10;

  // Корректируем горизонтальную позицию
  if (left < padding) left = padding;
  if (left + hintRect.width > viewportWidth - padding) {
    left = viewportWidth - hintRect.width - padding;
  }

  // Корректируем вертикальную позицию
  if (top < padding) top = padding;
  if (top + hintRect.height > viewportHeight - padding) {
    top = viewportHeight - hintRect.height - padding;
  }

  // После корректировки позиции пересчитываем смещение стрелки
  if (arrowPosition === 'top' || arrowPosition === 'bottom') {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const targetRect = targetElement.getBoundingClientRect();
      const targetCenterX = targetRect.left + targetRect.width / 2;
      arrowOffset = calculateArrowOffset(targetCenterX, left, hintRect.width, 10);
    }
  }

  return { top, left, arrowPosition, arrowOffset, elementVisible };
};


const calculatePositionScore = (
  position       : 'top' | 'bottom' | 'left' | 'right',
  targetRect     : DOMRect | undefined,
  hintRect       : DOMRect | undefined,
  viewportWidth  : number,
  viewportHeight : number
): number => {
  let score = 0;

  if (! targetRect || ! hintRect) {
    return score
  }

  switch (position) {
    case 'top':
      score = targetRect.top - hintRect.height - 10;
      break;
    case 'bottom':
      score = viewportHeight - targetRect.bottom - hintRect.height - 10;
      break;
    case 'left':
      score = targetRect.left - hintRect.width - 10;
      break;
    case 'right':
      score = viewportWidth - targetRect.right - hintRect.width - 10;
      break;

    default:
      score = 0;
  }

  // Штрафуем позиции, которые выходят за границы
  if (score < 0) score = -1000;

  return score;
};


export const calculateDesktopPosition = (
  targetId       : string,
  targetRect     : DOMRect | undefined,
  hintRect       : DOMRect | undefined,
  viewportWidth  : number,
  viewportHeight : number
): Position => {
  if (! targetRect || ! hintRect) {
    return DEFAULT_POSITION; // Return a default position if either rect is undefined
  }

  const positions: Position[] = [
    { // Сверху
      top: targetRect.top - hintRect.height - 10,
      left: targetRect.left + targetRect.width / 2 - hintRect.width / 2,
      arrowPosition: 'bottom',
      elementVisible : true,
      score: calculatePositionScore('top', targetRect, hintRect, viewportWidth, viewportHeight)
    },
    { // Снизу
      top: targetRect.bottom + 10,
      left: targetRect.left + targetRect.width / 2 - hintRect.width / 2,
      arrowPosition: 'top',
      elementVisible : true,
      score: calculatePositionScore('bottom', targetRect, hintRect, viewportWidth, viewportHeight)
    },
    { // Слева
      top: targetRect.top + targetRect.height / 2 - hintRect.height / 2,
      left: targetRect.left - hintRect.width - 10,
      arrowPosition: 'right',
      elementVisible : true,
      score: calculatePositionScore('left', targetRect, hintRect, viewportWidth, viewportHeight)
    },
    { // Справа
      top: targetRect.top + targetRect.height / 2 - hintRect.height / 2,
      left: targetRect.right + 10,
      arrowPosition: 'left',
      elementVisible : true,
      score: calculatePositionScore('right', targetRect, hintRect, viewportWidth, viewportHeight)
    }
  ];


  // Выбираем позицию с положительным score и приоритетным положением
  let bestPosition = {} as Position;

  // Hint Снизу
  const [upPosition, bottomPosition, leftPosition, rightPosition] = positions;
  if (bottomPosition.score && bottomPosition.score > 0) bestPosition = bottomPosition;
  // Hint Сверху
  else if (upPosition.score && upPosition.score > 0) bestPosition = upPosition;
  // Hint Слева
  else if (leftPosition.score && leftPosition.score > 0) bestPosition = leftPosition;
  // Hint Справа
  else if (rightPosition.score && rightPosition.score > 0) bestPosition = rightPosition;
  else bestPosition = DEFAULT_POSITION


  // Корректируем позицию, чтобы не выходить за границы viewport
  return adjustPositionToViewport(targetId, bestPosition, hintRect, viewportWidth, viewportHeight);
};
