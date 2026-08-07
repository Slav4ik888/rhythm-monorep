import { defaultIcons, DefaultIconId } from '../../default-icons';


/**
 * Get icon by id
 */
export const getIconById = (id?: DefaultIconId | null): MuiIcon | string => {
  if (! id) return ''

  return defaultIcons[id];
}
