// packages/backend/src/models/partner/mocks/index.ts
// Фикстуры PartnerData для unit-тестов сервисов partner.

import { PartnerData } from '../types';

export const MOCK_PARTNER_ID = 'azbuka';

/** Фабрика мокового PartnerData. Обязательные поля заполнены значениями по умолчанию. */
export const createMockPartner = (overrides: Partial<PartnerData> = {}): PartnerData => ({
  id: MOCK_PARTNER_ID,
  followers: 0,
  registerStarted: 0,
  registerStartedData: {},
  registered: 0,
  registeredData: {},
  ...overrides,
});
