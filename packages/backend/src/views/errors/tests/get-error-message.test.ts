// packages/backend/src/views/errors/tests/get-error-message.test.ts
// Unit-тесты getErrorMessage: маппинг ERR_CODE в пользовательские сообщения.

import { getErrorMessage } from '../get-error-message';
import { ERR_CODE } from '../err-code';

// Фиксируем конфиг загрузки файлов для предсказуемых ассертов (MaxFileSize).
jest.mock('../../../app/config', () => ({
  cfg: {
    UPLOAD: {
      MAX_FILE_SIZE: 3 * 1024 * 1024,
      MAX_TOTAL_FILE_SIZE: 12 * 1024 * 1024,
    },
  },
}));

describe('getErrorMessage', () => {
  it('MaxFileSize — размеры файлов в Mb', () => {
    expect(getErrorMessage(ERR_CODE.MaxFileSize)).toBe(
      'Превышен допустимый размер файлов. Максимальный размер файла - 3Mb. Общий размер всех файлов - 12Mb.',
    );
  });

  it('UnknownUserEmail / auth/user-not-found — с email', () => {
    const expected = 'Пользователь с email: "a@b.c" не найден.';
    expect(getErrorMessage(ERR_CODE.UnknownUserEmail, 'a@b.c')).toBe(expected);
    expect(getErrorMessage(ERR_CODE['auth/user-not-found'], 'a@b.c')).toBe(expected);
  });

  it('AccountDisabled', () => {
    expect(getErrorMessage(ERR_CODE.AccountDisabled)).toBe(
      'Данный аккаунт отключен. Обратитесь в службу технической поддержки.',
    );
  });

  it('EmailExist / auth/email-already-exists', () => {
    const expected = 'Этот email уже занят.';
    expect(getErrorMessage(ERR_CODE.EmailExist)).toBe(expected);
    expect(getErrorMessage(ERR_CODE['auth/email-already-exists'])).toBe(expected);
  });

  it('auth/email-already-in-use — с email', () => {
    expect(getErrorMessage(ERR_CODE['auth/email-already-in-use'], 'a@b.c')).toBe(
      'Введённый email: "a@b.c" уже зарегистрирован.',
    );
  });

  it('PasswordWrong / auth/wrong-password', () => {
    const expected = 'Не верный пароль, попробуйте ещё раз.';
    expect(getErrorMessage(ERR_CODE.PasswordWrong)).toBe(expected);
    expect(getErrorMessage(ERR_CODE['auth/wrong-password'])).toBe(expected);
  });

  it('auth/invalid-credential / auth/invalid-login-credentials', () => {
    const expected = 'Не верный email или пароль';
    expect(getErrorMessage(ERR_CODE['auth/invalid-credential'])).toBe(expected);
    expect(getErrorMessage(ERR_CODE['auth/invalid-login-credentials'])).toBe(expected);
  });

  it('UnauthorizedRequest', () => {
    expect(getErrorMessage(ERR_CODE.UnauthorizedRequest)).toBe('Неавторизованный запрос.');
  });

  it('CookieNotAuth / auth/id-token-expired', () => {
    const expected = 'Пользователь не авторизован.';
    expect(getErrorMessage(ERR_CODE.CookieNotAuth)).toBe(expected);
    expect(getErrorMessage(ERR_CODE['auth/id-token-expired'])).toBe(expected);
  });

  it('GeneratePasswordResetLink', () => {
    expect(getErrorMessage(ERR_CODE.GeneratePasswordResetLink)).toBe(
      'Не удалось создать ссылку для восстановления пароля',
    );
  });

  it('BadRequest', () => {
    expect(getErrorMessage(ERR_CODE.BadRequest)).toBe('Не корректный запрос');
  });

  it('InvalidData / InvalidEmail — с label', () => {
    expect(getErrorMessage(ERR_CODE.InvalidData, 'email')).toBe('Не корректные данные в поле "email".');
    expect(getErrorMessage(ERR_CODE.InvalidEmail)).toBe('Не корректные email.');
  });

  it('Required / AdditionalProperties', () => {
    expect(getErrorMessage(ERR_CODE.Required, 'email')).toBe('Не заполнено обязательное поле "email".');
    expect(getErrorMessage(ERR_CODE.AdditionalProperties, 'foo')).toBe('Присутствует дополнительное поле "foo".');
  });

  it('MinLength / MaxLength / Minimum / Maximum — с value', () => {
    expect(getErrorMessage(ERR_CODE.MinLength, 'password', 6)).toBe(
      'Поле "password" должно быть не меньше 6 символов.',
    );
    expect(getErrorMessage(ERR_CODE.MaxLength, 'name', 100)).toBe('Поле "name" должно быть не больше 100 символов.');
    expect(getErrorMessage(ERR_CODE.Minimum, 'age', 18)).toBe('Значение в поле "age" должно быть не меньше 18.');
    expect(getErrorMessage(ERR_CODE.Maximum, 'age', 99)).toBe('Значение в поле "age" должно быть не больше 99.');
  });

  it('Const / Format / FormatShouldBe', () => {
    expect(getErrorMessage(ERR_CODE.Const, 'role', 'admin')).toBe('Значение в поле "role" должно быть равно admin.');
    expect(getErrorMessage(ERR_CODE.Format, 'email')).toBe('Не корректный формат данных в поле "email".');
    expect(getErrorMessage(ERR_CODE.FormatShouldBe, 'phone', '+7...')).toBe(
      'Значение в поле "phone" должно быть +7....',
    );
  });

  it('NotBeError / MustBeNumber / MustBeOneOfSeveral / MustNotBeEmpty', () => {
    expect(getErrorMessage(ERR_CODE.NotBeError, 'name')).toBe('Поле "name" не должно быть ошибкой.');
    expect(getErrorMessage(ERR_CODE.MustBeNumber, 'age')).toBe('Поле "age" должно быть числом.');
    expect(getErrorMessage(ERR_CODE.MustBeOneOfSeveral, 'role')).toBe(
      'Поле "role" не является одним из допустимых значений.',
    );
    expect(getErrorMessage(ERR_CODE.MustNotBeEmpty, 'name')).toBe('Поле "name" не должно быть пустым.');
  });

  it('MustBeLess / MustBeGreater — с value', () => {
    expect(getErrorMessage(ERR_CODE.MustBeLess, 'name', 10)).toBe('Поле "name" должно быть не больше 10 символов.');
    expect(getErrorMessage(ERR_CODE.MustBeGreater, 'name', 2)).toBe('Поле "name" должно быть не меньше 2 символов.');
  });

  it('MustBeBool / MustBeString', () => {
    expect(getErrorMessage(ERR_CODE.MustBeBool, 'isActive')).toBe(
      'Не корректный тип данных. Поле "isActive" должно быть "да" или "нет".',
    );
    expect(getErrorMessage(ERR_CODE.MustBeString, 'name')).toBe(
      'Не корректный тип данных. Поле "name" должно быть строкой.',
    );
  });

  it('GuardCSRF / CannotGetData / FolderMustNotBeFull / MustBePermissions', () => {
    expect(getErrorMessage(ERR_CODE.GuardCSRF)).toBe('GuardCSRF.');
    expect(getErrorMessage(ERR_CODE.CannotGetData)).toBe('Не удалось получить данные.');
    expect(getErrorMessage(ERR_CODE.FolderMustNotBeFull)).toBe(
      'Нельзя удалить папку с вложенными папками или документами.',
    );
    expect(getErrorMessage(ERR_CODE.MustBePermissions)).toBe(
      'Для продолжения, необходимо предоставить согласие на обработку персональных данных.',
    );
  });

  it('DevMustBeOneOfSeveral / DevMustNotBeEmpty', () => {
    expect(getErrorMessage(ERR_CODE.DevMustBeOneOfSeveral, 'role')).toBe(
      'Поле "role" не является одним из допустимых значений. Это ошибка разработчика.',
    );
    expect(getErrorMessage(ERR_CODE.DevMustNotBeEmpty, 'name')).toBe(
      'Поле "name" не должно быть пустым. Это ошибка разработчика.',
    );
  });

  it('General', () => {
    expect(getErrorMessage(ERR_CODE.General)).toBe(
      'Извините, произошла непредвиденная ошибка. Мы уже отправили разработчику отчёт об этом.',
    );
  });

  it('default — возвращает сам errCode для неизвестных кодов', () => {
    const unknown = 'SomeUnknownCode' as ERR_CODE;
    expect(getErrorMessage(unknown)).toBe('SomeUnknownCode');
  });
});
