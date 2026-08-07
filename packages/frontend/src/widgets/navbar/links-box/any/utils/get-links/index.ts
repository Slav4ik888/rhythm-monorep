import { LinkType, RoutePath } from 'app/providers/routes';


export const getLinks = (companyId: string): LinkType[] => [
  {
    name        : 'Перейти в Dashboard',
    route       : `${companyId}/${RoutePath.DASHBOARD}`,
    requireAuth : true,
  },
];
