// packages/backend/src/shared/utils/objects/pick/index.ts

/**
 * Возвращает копию объекта только с указанными полями («белый список»).
 * Используется для защиты от mass assignment — сервер игнорирует поля,
 * которые клиент не имеет права менять.
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  if (!obj) return result;

  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  });

  return result;
}
