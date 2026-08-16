// packages/backend/src/libs/errors/api-error.ts
// Тип ошибки бизнес-логики: модели кидают Error с дополнительными полями
// statusCode (HTTP-статус) и body (тело ответа в едином формате API).

/** Ошибка бизнес-логики с HTTP-статусом и телом ответа */
export interface ApiError extends Error {
  statusCode?: number;
  body?: unknown;
  /** Ответ axios (внешний сервис, напр. Google Apps Script) */
  response?: { status?: number };
}
