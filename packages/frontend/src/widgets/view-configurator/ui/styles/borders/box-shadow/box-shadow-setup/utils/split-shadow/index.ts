
/**
 * boxShadow: '1px 2px 0px 2px rgba(184, 184, 184, 1)'
 *  =>  [1, 2, 0, 2, 'rgba(184, 184, 184, 1)']
 */
export const splitShadow = (value: number | string | undefined = '') => String(value)
  .split('px')
  .map(item => item.trim());
