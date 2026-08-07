import { creatorFixDate, SidebarListItem } from '../../../base';



interface CreateSheetConfig {
  userId : string
  id     : string
  title  : string
  iconId : string | null
  route  : string
  order  : number
}

export const creatorSheet = ({ userId, id, title, iconId, route, order }: CreateSheetConfig): SidebarListItem => {
  const date = creatorFixDate(userId);

  return {
    id,
    title,
    type       : 'collapse',
    iconId,
    route,
    order,
    createdAt  : date,
    lastChange : date
  }
};
