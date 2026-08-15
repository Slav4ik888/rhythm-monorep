import { PREFIX } from '../main';
import * as h from '../helpers';
import { HeavyStorage } from '../../../indexed-db';

export const clearStorage = async () => {
  // Сохраняем то, что не должно исчезнуть
  const cookie = h.getAcceptedCookie();
  const partnerId = h.getPartnerId();
  const hintsDontShowAgain = h.getHintsDontShowAgain();

  // Очищаем localStorage (мелкое UI-состояние/флаги)
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(PREFIX)) {
      localStorage.removeItem(key);
    }
  });

  // Очищаем IndexedDB («тяжёлые» per-company данные)
  await HeavyStorage.clear();

  // Восстанавливаем сохранённое
  if (cookie) h.setAcceptedCookie();
  if (partnerId) h.setPartnerId(partnerId);
  h.setHintsDontShowAgain(hintsDontShowAgain);

  // window.dispatchEvent(new Event('storageCleared'));
};
