import { SidebarListItem } from 'shared/types'


export type DashboardSheet = SidebarListItem

export type DashboardSheets = Record<string, DashboardSheet> // { [sheetId: string]: DashboardSheet }
