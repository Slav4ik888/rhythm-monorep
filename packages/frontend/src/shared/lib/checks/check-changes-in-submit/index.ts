import { isChanges } from '../../../helpers/objects';
import { UseGroup } from '../../hooks';
import { __devLog } from '../../tests/__dev-log';

/**
 * 2023-12-02
 * Проверяет были ли изменения
 * @param {boolean} exit is need to close the submit window, if there are np changes
 */
export function isChangesInSubmit<T>(
  hookOpen  : UseGroup<any>, // Тот хук кот управляет окошком
  storeData : T,
  newData   : T,
  exit?     : boolean // Нужно ли закрыть окно при submit
): boolean {
  const resultCheck = isChanges(storeData, newData);

  // hookOpen.setIsChange(false);
  hookOpen.setIsConfirm(false);

  __devLog('isChangesInSubmit', 'isChanges: ', newData, '-', resultCheck);
  if (! resultCheck) {
    if (exit) hookOpen.setClose();
    return false;
  }

    // if (exit) hookOpen.setClose();

    // Если есть изменения то не закрываем, чтобы далее если при валидации
    // вылезет ошибка, пользователь увидел её
    return true;
}
