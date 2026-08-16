// packages/backend/src/libs/emails/tests/send-group-mail.test.ts
// Unit-тесты sendGroupMail: групповая рассылка по списку адресов.

import { sendGroupMail } from '../send-group-mail';
import { sendMail } from '../send-mail';
import { loggerMail } from '../../loggers';

// Мокаем sendMail — проверяем только логику рассылки.
jest.mock('../send-mail', () => ({ sendMail: jest.fn() }));

// Мокаем логгер, чтобы winston не создавал File-transports.
jest.mock('../../loggers', () => ({
  loggerMail: { info: jest.fn(), error: jest.fn() },
}));

const sendMailMock = sendMail as jest.Mock;
const loggerInfoMock = loggerMail.info as jest.Mock;
const loggerErrorMock = loggerMail.error as jest.Mock;

const config = {
  template: 'info-registration',
  locals: { name: 'X' },
  to: 'ignored@mail.com',
  subject: 'Subject',
};

describe('sendGroupMail', () => {
  beforeEach(() => {
    sendMailMock.mockReset();
    loggerInfoMock.mockClear();
    loggerErrorMock.mockClear();
  });

  it('отправляет письмо каждому адресату и логирует успех', async () => {
    sendMailMock.mockResolvedValue({ messageId: 'ok' });

    await sendGroupMail(config, ['a@x.com', 'b@x.com'], 'sender@x.com');

    expect(sendMailMock).toHaveBeenCalledTimes(2);
    expect(sendMailMock).toHaveBeenNthCalledWith(1, {
      to: 'a@x.com',
      subject: 'Subject',
      locals: { name: 'X' },
      template: 'info-registration',
    });
    expect(sendMailMock).toHaveBeenNthCalledWith(2, {
      to: 'b@x.com',
      subject: 'Subject',
      locals: { name: 'X' },
      template: 'info-registration',
    });
    expect(loggerInfoMock).toHaveBeenCalledWith('[f]: sendGroupMail success');
  });

  it('логирует ошибку, если отправка падает', async () => {
    sendMailMock.mockRejectedValue(new Error('smtp down'));

    await sendGroupMail(config, ['a@x.com'], 'sender@x.com');

    expect(loggerErrorMock).toHaveBeenCalledWith(expect.any(Error));
    expect(loggerInfoMock).not.toHaveBeenCalled();
  });
});
