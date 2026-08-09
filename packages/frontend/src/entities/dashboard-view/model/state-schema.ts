// packages/frontend/src/entities/dashboard-view/model/state-schema.ts

import type { ViewItem, PartialViewItem, ViewItemId, ViewItemType, BunchesViewItem } from '../types';

export interface DashboardViewEntities {
  [viewItemId: string]: ViewItem;
}

/** Полное состояние dashboard-view стора (синхронизировано с реальным Zustand-стором) */
export interface StateSchemaDashboardView {
  loading: boolean;
  errors: Record<string, string>;
  _isMounted: boolean;
  _isLoaded: boolean;
  editMode: boolean;
  /** Нормализованные view-элементы: { [id]: ViewItem } */
  entities: DashboardViewEntities;
  newSelectedId: ViewItemId;
  selectedId: ViewItemId;
  bright: boolean;
  isUnsaved: boolean;
  newStoredViewItem: ViewItem | undefined;
  prevStoredViewItem: ViewItem | undefined;
  activatedMovementId: ViewItemId;
  activatedCopied: ActivatedCopiedType | undefined;
}

export interface ActivatedCopiedType {
  type?: 'viewItem' | 'styles' | ViewItemType;
  id?: ViewItemId;
  viewItem?: PartialViewItem | null;
}

export interface SetDashboardViewItems {
  viewItems: ViewItem[];
}

export interface SetEditMode {
  editMode: boolean;
  companyId?: string;
}

export interface SetDashboardBunchesFromCache {
  companyId: string;
  changedBunches: BunchesViewItem | null;
}

/** Изменение одного поля в charts[index] */
export interface ChangeOneChartsItem {
  viewItemId: string;
  field: string;
  value: any;
  index?: number;
}

/** Изменение одного поля в datasets[index] */
export interface ChangeOneDatasetsItem {
  viewItemId: string;
  datasetIdx: number;
  field: string;
  value: any;
  index?: number;
}

/** Изменение одного поля в settings (стор сам знает selectedId, viewItemId опционален) */
export interface ChangeOneSettingsField {
  viewItemId?: string;
  field: string;
  value: any;
}

/** Изменение одного поля стиля (стор сам знает selectedId) */
export interface ChangeSelectedStyle {
  viewItemId?: string;
  field: string;
  value: any;
}
