/** Вышло ли время жизни кода? */
export const isCodeExpired = (
  codeTime: number, // Время получения кода
  lives: number, // Время жизни кода в милисекундах
) => Date.now() - codeTime > lives;
