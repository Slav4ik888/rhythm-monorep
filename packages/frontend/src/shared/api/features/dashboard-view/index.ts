// packages/frontend/src/shared/api/features/dashboard-view/index.ts

import { api } from '../../api';
import { API_PATHS } from '../../api-paths';

export interface PartialViewItemUpdate {
  [key: string]: any;
}

export interface CreateGroupViewItems {
  companyId: string;
  dashboardSheetId?: string;
  viewItemIds?: string[];
  targetItemId?: string;
  position?: 'before' | 'after' | 'inside';
  viewItems?: any[];
  bunchUpdatedMs?: number;
  bunchAction?: string;
}

export interface UpdateViewItems {
  companyId: string;
  dashboardSheetId?: string;
  updates?: Record<string, PartialViewItemUpdate>;
  viewItems?: any[];
  newStoredViewItem?: Record<string, any>;
  bunchUpdatedMs?: number;
}

export interface DeleteViews {
  companyId: string;
  dashboardSheetId?: string;
  viewItemIds?: string[];
  viewItems?: any[];
  bunchUpdatedMs?: number;
}

export const createGroupViewItems = async (payload: CreateGroupViewItems): Promise<any> => {
  const { data } = await api.post(API_PATHS.dashboard.view.createGroupItems, payload as any);
  return data;
};

export const updateViewItems = async (payload: UpdateViewItems): Promise<any> => {
  const { data } = await api.post(API_PATHS.dashboard.view.update, payload as any);
  return data;
};

export const deleteViewItems = async (payload: DeleteViews): Promise<any> => {
  const { data } = await api.post(API_PATHS.dashboard.view.delete, payload as any);
  return data;
};
