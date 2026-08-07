import { SidebarListItem } from 'shared/types';
import { creatorFixDate } from 'entities/base';
import { getPathBySheetId } from '../../../lib';
import { NO_SHEET_ID } from 'entities/dashboard-view';



const date = creatorFixDate('Korzant', 1752019200000); // 1752019200000  - '2025-07-09'


export const getDefaultSidebarRoutes = (companyId: string): SidebarListItem[] => [
  {
    id         : NO_SHEET_ID,
    type       : 'collapse',
    title      : 'Главная',
    iconId     : 'equalizer',
    route      : getPathBySheetId(companyId),
    order      : 100,
    createdAt  : date,
    lastChange : date
  },
  {
    id         : 'divider-1',
    type       : 'divider',
    order      : 500,
    createdAt  : date,
    lastChange : date
  },
];
