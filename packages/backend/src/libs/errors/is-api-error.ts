// packages/backend/src/libs/errors/is-api-error.ts
// Type guard для ошибок бизнес-логики моделей.

import type { ApiError } from './api-error';

/** ApiError с обязательным числовым statusCode (после проверки guard'ом) */
export type ApiErrorWithStatus = ApiError & { statusCode: number };

/** Определяет, является ли ошибка «api-ошибкой» модели (Error + числовой statusCode). */
export const isApiError = (err: unknown): err is ApiErrorWithStatus =>
  err instanceof Error && typeof (err as ApiError).statusCode === 'number';
