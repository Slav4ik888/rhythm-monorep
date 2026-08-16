// packages/backend/src/shared/utils/objects/omit/index.ts

/**
 * Возвращает копию объекта без указанных полей.
 * Используется для отсечения служебных полей, которые управляются сервером.
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> {
  const result: Record<string, unknown> = { ...(obj as Record<string, unknown>) };
  keys.forEach((key) => {
    delete result[key as string];
  });

  return result as Omit<T, K>;
}
