// packages/frontend/src/shared/lib/tests/__dev-log/index.ts

/**
 * Выводит сообщение в консоль, если не продакшен.
 *  flag '--force' чтобы показать в production
 * @param funcName - имя функции. Если не нужно выводит имя ф-ции тогда args должен отсутствовать
 * @param args - аргументы для вывода
 * Варианты использования:
 *  devLog('Лог только в development'); // Не покажется в production
 *  devLog('Важное сообщение', '--force'); // Покажется даже в production
 */
export function __devLog(funcName: any, ...args: any[]): void {
  // const isProduction = process.env.NODE_ENV === 'production';
  const hasForceFlag = args.includes('--force');

  if (__IS_DEV__ || hasForceFlag) {
    // Фильтруем аргументы, исключая флаг '--force'
    const filteredArgs = args.filter((arg) => arg !== '--force');
    // args — всегда массив (rest-параметр), проверяем длину filteredArgs
    if (filteredArgs.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`[${funcName}]`, ...filteredArgs);
    } else if (args.length === 0) {
      // eslint-disable-next-line no-console
      console.log(funcName);
    } else {
      // Все аргументы были --force — выводим только имя функции
      // eslint-disable-next-line no-console
      console.log(funcName);
    }
  }
}
