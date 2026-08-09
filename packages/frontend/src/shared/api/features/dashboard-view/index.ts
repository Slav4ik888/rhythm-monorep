// packages/frontend/src/shared/api/features/dashboard-view/index.ts

import { api } from '../../api';
import { API_PATHS } from '../../api-paths';

export interface PartialViewItemUpdate {
  [key: string]: any;
}

export interface CreateGroupViewItems {
  companyId: string;
  dashboardSheetId: string;
  viewItemIds: string[];
  targetItemId: string;
  position: 'before' | 'after' | 'inside';
}

export interface UpdateViewItems {
  companyId: string;
  dashboardSheetId?: string;
  updates?: Record<string, PartialViewItemUpdate>;
  /** ViewItems для сохранения в LS */
  viewItems?: any[];
  /** Новое сохранённое состояние элемента */
  newStoredViewItem?: Record<string, any>;
  /** Timestamp обновления bunches */
  bunchUpdatedMs?: number;
}

export interface DeleteViews {
  companyId: string;
  dashboardSheetId?: string;
  viewItemIds?: string[];
  /** ViewItems для удаления из LS */
  viewItems?: any[];
  /** Timestamp обновления bunches */
  bunchUpdatedMs?: number;
}

export const createGroupViewItems = async (payload: CreateGroupViewItems): Promise<any> => {
  const { data } = await api.post(API_PATHS.dashboard.view.createGroupItems, payload);
  return data;
};

export const updateViewItems = async (payload: UpdateViewItems): Promise<any> => {
  const { data } = await api.post(API_PATHS.dashboard.view.update, payload);
  return data;
};

export const deleteViewItems = async (payload: DeleteViews): Promise<any> => {
  const { data } = await api.post(API_PATHS.dashboard.view.delete, payload);
  return data;
};
