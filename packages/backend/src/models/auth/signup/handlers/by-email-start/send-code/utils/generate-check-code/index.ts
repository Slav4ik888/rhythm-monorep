/** Возвращает код проверки длиной 6 цифр */
export const generateCheckCode = () => Math.floor(100000 + Math.random() * 900000).toString();
