// packages/frontend/src/entities/dashboard-view/model/state-schema.ts

import type { ViewItem, PartialViewItem } from '../types';

export interface DashboardViewEntities {
  [viewItemId: string]: ViewItem;
}

export interface StateSchemaDashboardView {
  viewItems: ViewItem[];
  selectedId: string;
  editMode: boolean;
  copiedId: string;
  loading: boolean;
  errors: Record<string, string>;
}

export interface ActivatedCopiedType {
  viewItem: PartialViewItem | null;
}

export interface ActivatedCopied {
  activatedCopied?: ActivatedCopiedType;
}

export interface SetDashboardViewItems {
  viewItems: ViewItem[];
}

export interface SetEditMode {
  editMode: boolean;
}

export interface ChangeOneChartsItem {
  viewItemId: string;
  field: string;
  value: any;
}

export interface ChangeOneDatasetsItem {
  viewItemId: string;
  datasetIdx: number;
  field: string;
  value: any;
}

export interface ChangeOneSettingsField {
  viewItemId: string;
  field: string;
  value: any;
}

export interface ChangeSelectedStyle {
  viewItemId: string;
  style: string;
  value: any;
}
