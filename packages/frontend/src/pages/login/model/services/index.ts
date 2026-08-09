// packages/frontend/src/pages/login/model/services/index.ts
// Заглушка после удаления Redux-thunk. Содержит типы для обратной совместимости.

export interface LoginByUsername {
  email: string;
  password: string;
}

export interface ResetEmailPassword {
  email: string;
}

export interface AuthByLogin {
  email: string;
  password: string;
}
