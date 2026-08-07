import { Position } from 'entities/hints';
import { calculateDesktopPosition } from './calc-desktop';
import { calculateMobilePosition } from './calc-mobile';


export const calculateOptimalPosition = (
  targetId      : string,
  targetElement : HTMLElement,
  hintElement   : HTMLElement,
  isMobileView  : boolean
): Position => {
  const targetRect = targetElement.getBoundingClientRect();
  const hintRect = hintElement.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Проверяем, виден ли элемент в viewport
  const isElementInViewport = (
    targetRect.top >= 0
    && targetRect.left >= 0
    && targetRect.bottom <= viewportHeight
    && targetRect.right <= viewportWidth
  );

  // Если элемент не в зоне видимости, показываем подсказку в центре экрана
  if (! isElementInViewport) {
    return {
      top            : viewportHeight / 2 - hintRect.height / 2,
      left           : viewportWidth / 2 - hintRect.width / 2,
      arrowPosition  : 'none', // Скрываем стрелку
      elementVisible : false
    };
  }

  // Для мобильной версии используем упрощенное позиционирование
  if (isMobileView) {
    return calculateMobilePosition(targetRect, hintRect, viewportWidth, viewportHeight);
  }

  // Для десктопной версии
  return calculateDesktopPosition(targetId, targetRect, hintRect, viewportWidth, viewportHeight);
};
