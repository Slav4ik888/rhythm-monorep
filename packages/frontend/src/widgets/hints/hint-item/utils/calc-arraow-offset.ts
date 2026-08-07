
export const calculateArrowOffset = (
  targetCenter : number,
  hintPosition : number,
  hintSize     : number,
  arrowSize    : number
): number => {
  // Идеальная позиция стрелки - центр целевого элемента относительно подсказки
  const idealArrowPosition = targetCenter - hintPosition;

  // Ограничиваем позицию стрелки в пределах подсказки (с отступами)
  const minArrowPosition = arrowSize + 10;
  const maxArrowPosition = hintSize - arrowSize - 10;

  return Math.max(minArrowPosition, Math.min(idealArrowPosition, maxArrowPosition));
};
