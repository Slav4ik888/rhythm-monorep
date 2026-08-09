// packages/frontend/src/app/providers/store/index.ts
// Заглушка после удаления Redux. Оставлена для обратной совместимости импортов.

import type { Errors } from 'shared/lib/validators';

export interface CustomAxiosError {
  response?: {
    data?: Errors;
  };
}

/** Обработчики ошибок (раньше были в Redux error-handlers) */
export const errorHandlers = {
  handleError: (error: CustomAxiosError): Errors => error?.response?.data || { general: 'Unknown error' },
};
