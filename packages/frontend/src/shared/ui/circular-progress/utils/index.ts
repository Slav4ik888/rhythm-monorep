import { isUndefined } from 'shared/lib/validators';



export interface ElementDimentions {
  width  : number | undefined
  height : number | undefined
}

const
  getParentWidth      = (elem: HTMLElement | null) => elem?.parentElement?.clientWidth,
  getParentHeight     = (elem: HTMLElement | null) => elem?.parentElement?.clientHeight,
  getParentDimentions = (elem: HTMLElement | null): ElementDimentions => ({
    width  : getParentWidth(elem),
    height : getParentHeight(elem)
  });

/**
 * Calc and get display height or parentElement
 */
const getCenterHeight = (
  id: string
  // parentH: number,
): number => {
  const
    parentH = getParentDimentions(document.getElementById(id))?.height,
    windowH = document.documentElement.clientHeight

  let h = 0;

  if (isUndefined(parentH)) h = windowH
  else h = (windowH > (parentH as number) ? parentH : windowH) as number;

  // if (id != 'CircularId') {
  //   console.log('windowH: ', windowH);
  //   console.log('parentH: ', parentH);
  //   console.log('h: ', h);
  // }

  return h
};


/**
 * String for CSS style - top
 */
export const getTopCenter = (id: string, size: number): string => {
  const
    h = getCenterHeight(id),
    scrollH = window.pageYOffset;

  return `calc(${h / 2 + scrollH}px - ${size / 2}px)`
};
