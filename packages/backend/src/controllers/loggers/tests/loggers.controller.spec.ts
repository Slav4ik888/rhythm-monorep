// packages/backend/src/controllers/loggers/tests/loggers.controller.spec.ts
// Integration-тесты LoggersController (NestJS + Fastify, HTTP через app.inject)

import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { LoggersController } from '../loggers.controller';
import { logsViewModel } from '../../../models/loggers/handlers/view';
import { logsDownloadModel } from '../../../models/loggers/handlers/download';
import { logsClearModel } from '../../../models/loggers/handlers/clear';

// Мокаем модели — контроллер импортирует их напрямую (не через DI)
jest.mock('../../../models/loggers/handlers/view', () => ({ logsViewModel: jest.fn() }));
jest.mock('../../../models/loggers/handlers/download', () => ({ logsDownloadModel: jest.fn() }));
jest.mock('../../../models/loggers/handlers/clear', () => ({ logsClearModel: jest.fn() }));

const logsViewModelMock = logsViewModel as jest.Mock;
const logsDownloadModelMock = logsDownloadModel as jest.Mock;
const logsClearModelMock = logsClearModel as jest.Mock;

const get = (app: NestFastifyApplication, url: string) => app.inject({ method: 'GET', url });

describe('LoggersController (integration)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [LoggersController],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/logs/view/:name/:pass', () => {
    it('возвращает HTML-страницу логов', async () => {
      logsViewModelMock.mockResolvedValue({ html: '<html><body>log</body></html>', statusCode: 200 });

      const response = await get(app, '/api/logs/view/errors/test-pass');

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
      expect(response.body).toContain('log');
      expect(logsViewModelMock).toHaveBeenCalledWith({ name: 'errors', pass: 'test-pass' });
    });

    it('возвращает 403 при неверном пароле', async () => {
      logsViewModelMock.mockResolvedValue({ html: 'Access denied', statusCode: 403 });

      const response = await get(app, '/api/logs/view/errors/bad-pass');

      expect(response.statusCode).toBe(403);
      expect(response.body).toBe('Access denied');
    });
  });

  describe('GET /api/logs/download/:name/:pass', () => {
    it('возвращает файл лога для скачивания', async () => {
      logsDownloadModelMock.mockResolvedValue({
        statusCode: 200,
        body: 'log line 1',
        contentType: 'text/plain',
        contentDisposition: 'attachment; filename="errors.log"',
      });

      const response = await get(app, '/api/logs/download/errors/test-pass');

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toBe('text/plain');
      expect(response.headers['content-disposition']).toBe('attachment; filename="errors.log"');
      expect(response.body).toBe('log line 1');
      expect(logsDownloadModelMock).toHaveBeenCalledWith({ name: 'errors', pass: 'test-pass' });
    });

    it('возвращает 403 при неверном пароле', async () => {
      logsDownloadModelMock.mockResolvedValue({ statusCode: 403, body: 'Access denied' });

      const response = await get(app, '/api/logs/download/errors/bad-pass');

      expect(response.statusCode).toBe(403);
      expect(response.body).toBe('Access denied');
    });
  });

  describe('GET /api/logs/clear/:name/:pass', () => {
    it('очищает лог и возвращает JSON-ответ', async () => {
      logsClearModelMock.mockResolvedValue({
        statusCode: 200,
        body: { message: 'Log file successfully cleared' },
      });

      const response = await get(app, '/api/logs/clear/errors/test-pass');

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.json()).toEqual({ message: 'Log file successfully cleared' });
      expect(logsClearModelMock).toHaveBeenCalledWith({ name: 'errors', pass: 'test-pass' });
    });

    it('возвращает 403 при неверном пароле', async () => {
      logsClearModelMock.mockResolvedValue({ statusCode: 403, body: 'Access denied' });

      const response = await get(app, '/api/logs/clear/errors/bad-pass');

      expect(response.statusCode).toBe(403);
    });
  });
});
