// packages/backend/src/models/dashboard-view/mocks/index.ts
// Фикстуры ViewItem для unit-тестов сервисов dashboard-view.

import { creatorFixDate } from '../../base';
import { NO_PARENT_ID } from '../consts';
import { ViewItem } from '../types';

export const MOCK_BUNCH_ID_1 = 'bunch-1';
export const MOCK_BUNCH_ID_2 = 'bunch-2';
export const MOCK_SHEET_ID = 'sheet-1';

/** Фабрика мокового ViewItem. Обязательные поля заполнены значениями по умолчанию. */
export const createMockViewItem = (overrides: Partial<ViewItem> = {}): ViewItem => ({
  id: 'view-item-1',
  bunchId: MOCK_BUNCH_ID_1,
  parentId: NO_PARENT_ID,
  sheetId: MOCK_SHEET_ID,
  type: 'box',
  styles: {},
  createdAt: creatorFixDate('mock-user-id', 1),
  lastChange: creatorFixDate('mock-user-id', 1),
  ...overrides,
});
