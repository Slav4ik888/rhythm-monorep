import { SidebarListItem } from '../../base/sidebar/types'


export type DashboardSheet = SidebarListItem

export type DashboardSheets = Record<string, DashboardSheet> // { [sheetId: string]: DashboardSheet }
