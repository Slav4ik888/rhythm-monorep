// packages/backend/src/libs/emails/tests/send-mail.test.ts
// Unit-тесты sendMail: рендер pug-шаблона, инлайн CSS через juice и отправка письма.

import { sendMail } from '../send-mail';
import { createTransport } from 'nodemailer';
import { renderFile } from 'pug';
import juice from 'juice';

// Мокаем тяжёлые зависимости: pug (рендер), juice (инлайн стилей),
// nodemailer (создание транспорта) и плагины транспорта.
jest.mock('pug', () => ({ renderFile: jest.fn() }));
jest.mock('juice', () => ({ __esModule: true, default: jest.fn((html: string) => html) }));
jest.mock('nodemailer', () => {
  const transport = { use: jest.fn(), sendMail: jest.fn() };
  return { createTransport: jest.fn(() => transport) };
});
jest.mock('nodemailer-html-to-text', () => ({ htmlToText: jest.fn(() => ({})) }));
jest.mock('nodemailer-smtp-transport', () => ({ __esModule: true, default: jest.fn(() => ({})) }));
jest.mock('nodemailer-stub-transport', () => ({ __esModule: true, default: jest.fn(() => ({})) }));

const createTransportMock = createTransport as jest.Mock;
const renderFileMock = renderFile as jest.Mock;
const juiceMock = juice as unknown as jest.Mock;

// Транспорт создаётся один раз при импорте send-mail (module-level createTransport).
const transport = createTransportMock.mock.results[0].value as {
  use: jest.Mock;
  sendMail: jest.Mock;
};

describe('sendMail', () => {
  beforeEach(() => {
    renderFileMock.mockReset();
    renderFileMock.mockReturnValue('<p>Hello</p>');
    juiceMock.mockClear();
    transport.sendMail.mockReset();
    transport.sendMail.mockResolvedValue({ messageId: 'm1' });
  });

  it('рендерит шаблон, инлайнит стили и отправляет письмо', async () => {
    const res = await sendMail({
      template: 'confirmation',
      locals: { name: 'Vasya' },
      to: 'user@mail.com',
      subject: 'Подтвердите почту',
    });

    expect(renderFileMock).toHaveBeenCalledWith(expect.stringContaining('confirmation.pug'), { name: 'Vasya' });
    expect(juiceMock).toHaveBeenCalledWith('<p>Hello</p>');
    expect(transport.sendMail).toHaveBeenCalledWith({
      html: '<p>Hello</p>',
      to: { name: 'not named', address: 'user@mail.com' },
      subject: 'Подтвердите почту',
      attachments: undefined,
    });
    expect(res).toEqual({ messageId: 'm1' });
  });

  it('передаёт attachments при наличии', async () => {
    const attachments = [{ filename: 'file.txt', path: '/tmp/file.txt' }];

    await sendMail({
      template: 'confirmation',
      locals: {},
      to: 'user@mail.com',
      subject: 'Subject',
      attachments,
    });

    expect(transport.sendMail).toHaveBeenCalledWith(expect.objectContaining({ attachments }));
  });

  it('подставляет пустой объект locals, если locals не передан', async () => {
    await sendMail({
      template: 'confirmation',
      locals: undefined as any,
      to: 'user@mail.com',
      subject: 'Subject',
    });

    expect(renderFileMock).toHaveBeenCalledWith(expect.stringContaining('confirmation.pug'), {});
  });
});
