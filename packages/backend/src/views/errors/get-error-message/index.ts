import { cfg } from '../../../app/config';
import { ERR_CODE } from '../err-code';



export function getErrorMessage(
  errCode  : ERR_CODE,
  message? : string, // Field | Label
  value?   : number | string
): string {
  const label = message ? `"${message}"` : '';

  switch (errCode) {
    case ERR_CODE.MaxFileSize:                       return `Превышен допустимый размер файлов. Максимальный размер файла - ${cfg.UPLOAD.MAX_FILE_SIZE / (1024 * 1024)}Mb. Общий размер всех файлов - ${cfg.UPLOAD.MAX_TOTAL_FILE_SIZE / (1024 * 1024)}Mb.`;
    case ERR_CODE.UnknownUserEmail:
    case ERR_CODE['auth/user-not-found']:            return `Пользователь с email: ${label} не найден.`;

    case ERR_CODE.AccountDisabled:                   return 'Данный аккаунт отключен. Обратитесь в службу технической поддержки.';
    case ERR_CODE.EmailExist:
    case ERR_CODE['auth/email-already-exists']:      return 'Этот email уже занят.';

    case ERR_CODE['auth/email-already-in-use']:      return `Введённый email: ${label} уже зарегистрирован.`

    case ERR_CODE.PasswordWrong:
    case ERR_CODE['auth/wrong-password']:            return 'Не верный пароль, попробуйте ещё раз.';

    case ERR_CODE['auth/invalid-credential']:
    case ERR_CODE['auth/invalid-login-credentials']: return 'Не верный email или пароль';

    case ERR_CODE.UnauthorizedRequest:               return 'Неавторизованный запрос.';
    case ERR_CODE.CookieNotAuth:
    case ERR_CODE['auth/id-token-expired']:          return 'Пользователь не авторизован.';

    case ERR_CODE.GeneratePasswordResetLink:         return 'Не удалось создать ссылку для восстановления пароля';

    case ERR_CODE.BasRequest:
    case ERR_CODE['Bad Request']:         return 'Не корректный запрос';

    // -------------------------------------------------------------------------------------

    case ERR_CODE.InvalidData:            return `Не корректные данные в поле ${label}.`;
    case ERR_CODE.InvalidEmail:           return 'Не корректные email.';

    case ERR_CODE.Required:               return `Не заполнено обязательное поле ${label}.`;
    case ERR_CODE.AdditionalProperties:   return `Присутствует дополнительное поле ${label}.`;
    case ERR_CODE.MinLength:              return `Поле ${label} должно быть не меньше ${value} символов.`;
    case ERR_CODE.MaxLength:              return `Поле ${label} должно быть не больше ${value} символов.`;
    case ERR_CODE.Minimum:                return `Значение в поле ${label} должно быть не меньше ${value}.`;
    case ERR_CODE.Maximum:                return `Значение в поле ${label} должно быть не больше ${value}.`;

    case ERR_CODE.Const:                  return `Значение в поле ${label} должно быть равно ${value}.`;
    case ERR_CODE.Format:                 return `Не корректный формат данных в поле ${label}.`;
    case ERR_CODE.FormatShouldBe:         return `Значение в поле ${label} должно быть ${value}.`;

    case ERR_CODE.NotBeError:             return `Поле ${label} не должно быть ошибкой.`;
    case ERR_CODE.MustBeNumber:           return `Поле ${label} должно быть числом.`;
    case ERR_CODE.MustBeOneOfSeveral:     return `Поле ${label} не является одним из допустимых значений.`;
    case ERR_CODE.MustNotBeEmpty:         return `Поле ${label} не должно быть пустым.`;
    case ERR_CODE.MustBeLess:             return `Поле ${label} должно быть не больше ${value} символов.`;
    case ERR_CODE.MustBeGreater:          return `Поле ${label} должно быть не меньше ${value} символов.`;
    case ERR_CODE.MustBeBool:             return `Не корректный тип данных. Поле ${label} должно быть "да" или "нет".`;
    case ERR_CODE.MustBeString:           return `Не корректный тип данных. Поле ${label} должно быть строкой.`;
    case ERR_CODE.GuardCSRF:              return `GuardCSRF.`;

    // -------------------------------------------------------------------------------------

    case ERR_CODE.CannotGetData:          return 'Не удалось получить данные.';

    case ERR_CODE.FolderMustNotBeFull:    return 'Нельзя удалить папку с вложенными папками или документами.';
    case ERR_CODE.MustBePermissions:      return 'Для продолжения, необходимо предоставить согласие на обработку персональных данных.';

    case ERR_CODE.DevMustBeOneOfSeveral:  return `Поле ${label} не является одним из допустимых значений. Это ошибка разработчика.`;
    case ERR_CODE.DevMustNotBeEmpty:      return `Поле ${label} не должно быть пустым. Это ошибка разработчика.`;

    case ERR_CODE.General:                return 'Извините, произошла непредвиденная ошибка. Мы уже отправили разработчику отчёт об этом.'
    default: return errCode // 'Неизвестная ошибка.';
  }
}
