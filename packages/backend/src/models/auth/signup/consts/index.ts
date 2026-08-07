import { min, sec } from '../../../../shared/utils/dates';

/** Частота времени на запрос нового кода */
export const SIGNUP_CODE_DELAY = min(1);
/** Время жизни кода */
export const SIGNUP_CODE_EXPIRED = min(5);
/** Частота времени на ввод кода */
export const SIGNUP_CODE_ANSWER_DELAY = sec(5);
