import { Position, DEFAULT_POSITION } from 'entities/hints';
import { calculateArrowOffset } from './calc-arraow-offset';

const calculateOptimalLeftPosition = (
  targetRect    : DOMRect | undefined,
  hintRect      : DOMRect | undefined,
  viewportWidth : number,
  padding       : number
): number => {
  if (! targetRect || ! hintRect) {
    return 0
  }
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const idealLeft = targetCenterX - hintRect.width / 2;

  // Корректируем, чтобы подсказка не выходила за границы
  if (idealLeft < padding) {
    return padding;
  }
  if (idealLeft + hintRect.width > viewportWidth - padding) {
    return viewportWidth - hintRect.width - padding;
  }

  return idealLeft;
};


export const calculateMobilePosition = (
  targetRect     : DOMRect | undefined,
  hintRect       : DOMRect | undefined,
  viewportWidth  : number,
  viewportHeight : number
): Position => {
  if (! targetRect || ! hintRect) {
    return DEFAULT_POSITION; // Return a default position if either rect is undefined
  }

  const mobilePadding = 16;
  const arrowSize = 10;

  // Рассчитываем идеальную позицию стрелки (центр целевого элемента)
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const idealArrowPosition = targetCenterX;

  // Предпочтения для мобильной версии
  const positions: Position[] = [
    { // Снизу
      top            : targetRect.bottom + arrowSize,
      left           : calculateOptimalLeftPosition(targetRect, hintRect, viewportWidth, mobilePadding),
      arrowPosition  : 'top',
      elementVisible : true,
      score          : viewportHeight - targetRect.bottom - hintRect.height
    },
    { // Сверху
      top            : Math.max(mobilePadding, targetRect.top - hintRect.height - arrowSize),
      left           : calculateOptimalLeftPosition(targetRect, hintRect, viewportWidth, mobilePadding),
      arrowPosition  : 'bottom',
      elementVisible : true,
      score          : targetRect.top - hintRect.height
    }
  ];

  // Выбираем лучшую позицию
  const bestPosition = positions.reduce((best, current) =>
    (current?.score ?? 0) > (best?.score ?? 0) ? current : best
  );

  // Рассчитываем смещение стрелки
  const arrowOffset = calculateArrowOffset(
    idealArrowPosition,
    bestPosition.left,
    hintRect.width,
    arrowSize
  );

  return {
    ...bestPosition,
    arrowOffset,
    left: Math.max(mobilePadding, Math.min(
      bestPosition.left,
      viewportWidth - hintRect.width - mobilePadding
    ))
  };
}
