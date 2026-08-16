// packages/backend/src/models/dashboard-view/utils/filter-view-item/index.ts

import { omit } from '../../../../shared/utils/objects/omit';
import type { ViewItem } from '../../types';

/** Поля ViewItem, управляемые сервером — их нельзя передавать с клиента */
export const VIEW_ITEM_SERVER_FIELDS = ['createdAt', 'lastChange'] as const;

/** Отсекает серверные поля из одного элемента дашборда */
export const filterViewItem = <T extends Partial<ViewItem>>(item: T): Omit<T, 'createdAt' | 'lastChange'> =>
  omit(item, VIEW_ITEM_SERVER_FIELDS);

/** Отсекает серверные поля из массива элементов дашборда */
export const filterViewItems = <T extends Partial<ViewItem>>(items: T[]): T[] =>
  items.map((item) => filterViewItem(item) as T);
