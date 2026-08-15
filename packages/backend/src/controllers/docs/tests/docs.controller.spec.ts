// packages/backend/src/controllers/docs/tests/docs.controller.spec.ts
// Integration-тесты DocsController (NestJS + Fastify, HTTP через app.inject)

import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocsController } from '../docs.controller';
import { getPolicyModel } from '../../../models/docs/handlers/get-policy';

// Мокаем модель — контроллер импортирует её напрямую (не через DI)
jest.mock('../../../models/docs/handlers/get-policy', () => ({ getPolicyModel: jest.fn() }));

const getPolicyModelMock = getPolicyModel as jest.Mock;

const get = (app: NestFastifyApplication, url: string) => app.inject({ method: 'GET', url });

describe('DocsController (integration)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [DocsController],
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

  describe('GET /api/getPolicy (публичный)', () => {
    it('возвращает текст политики конфиденциальности', async () => {
      getPolicyModelMock.mockResolvedValue({ policy: '# Политика' });

      const response = await get(app, '/api/getPolicy');

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ policy: '# Политика' });
      expect(getPolicyModelMock).toHaveBeenCalledTimes(1);
    });

    it('возвращает 500 при ошибке чтения файла политики', async () => {
      getPolicyModelMock.mockRejectedValue(new Error('ENOENT'));

      const response = await get(app, '/api/getPolicy');

      expect(response.statusCode).toBe(500);
    });
  });
});
