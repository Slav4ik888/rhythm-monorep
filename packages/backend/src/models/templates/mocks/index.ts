// packages/backend/src/models/templates/mocks/index.ts
// Фикстуры Template для unit-тестов сервисов templates.

import { creatorFixDate } from '../../base';
import { createMockViewItem } from '../../dashboard-view/mocks';
import { Template } from '../types';

export const MOCK_TEMPLATE_BUNCH_ID_1 = 'template-bunch-1';
export const MOCK_TEMPLATE_BUNCH_ID_2 = 'template-bunch-2';

/** Фабрика мокового Template. Обязательные поля заполнены значениями по умолчанию. */
export const createMockTemplate = (overrides: Partial<Template> = {}): Template => ({
  id: 'template-1',
  bunchId: MOCK_TEMPLATE_BUNCH_ID_1,
  type: 'box',
  viewItems: { 'item-1': createMockViewItem({ id: 'item-1' }) },
  createdAt: creatorFixDate('mock-user-id', 1),
  lastChange: creatorFixDate('mock-user-id', 1),
  ...overrides,
});
