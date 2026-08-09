// packages/frontend/src/entities/dashboard-view/model/state-schema.ts

import type { ViewItem, PartialViewItem, ViewItemId, ViewItemType } from '../types';

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
  type?: 'viewItem' | 'styles' | 'copyItemsAll' | 'copyItemFirstOnly' | 'copyStyles' | ViewItemType | string;
  id?: ViewItemId;
  viewItem?: PartialViewItem | null;
}

export interface SetDashboardViewItems {
  viewItems: ViewItem[];
  companyId?: string;
  bunchesUpdated?: Record<string, number>;
}

export interface SetEditMode {
  editMode: boolean;
  companyId?: string;
}

export interface SetDashboardBunchesFromCache {
  companyId: string;
  changedBunches: string[] | null;
}

/** Изменение одного поля в charts[index] (стор сам знает selectedId, viewItemId опционален) */
export interface ChangeOneChartsItem {
  viewItemId?: string;
  field: string;
  value: any;
  index?: number;
}

/** Изменение одного поля в datasets[index] (стор сам знает selectedId, viewItemId опционален) */
export interface ChangeOneDatasetsItem {
  viewItemId?: string;
  datasetIdx?: number;
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
  funcName?: string;
}
