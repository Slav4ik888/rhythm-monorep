// packages/frontend/src/entities/dashboard-view/model/services/index.ts
// Типы, используемые стором для API-взаимодействия

export interface ReqGetBunches {
  companyId: string;
  bunchIds?: string[];
  bunchesUpdated?: Record<string, number>;
}
