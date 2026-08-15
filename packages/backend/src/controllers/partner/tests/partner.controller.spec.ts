// packages/backend/src/controllers/partner/tests/partner.controller.spec.ts
// Integration-тесты PartnerController (NestJS + Fastify, HTTP через app.inject)

import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { PartnerController } from '../partner.controller';
import { increaseFollowerModel } from '../../../models/partner/handlers/increase-follower';

// Мокаем модель — контроллер импортирует её напрямую (не через DI)
jest.mock('../../../models/partner/handlers/increase-follower', () => ({
  increaseFollowerModel: jest.fn(),
}));

const increaseFollowerModelMock = increaseFollowerModel as jest.Mock;

const post = (app: NestFastifyApplication, url: string, payload: unknown) =>
  app.inject({
    method: 'POST',
    url,
    headers: { 'content-type': 'application/json' },
    payload: payload as object,
  });

describe('PartnerController (integration)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PartnerController],
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

  describe('POST /api/increaseFollower (публичный)', () => {
    it('увеличивает счётчик последователей и возвращает status ok', async () => {
      increaseFollowerModelMock.mockResolvedValue(undefined);

      const body = { partnerId: 'partner-1' };
      const response = await post(app, '/api/increaseFollower', body);

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ status: 'ok' });
      expect(increaseFollowerModelMock).toHaveBeenCalledWith(body);
    });

    it('пробрасывает 400 от модели', async () => {
      increaseFollowerModelMock.mockRejectedValue(
        Object.assign(new Error('Invalid partnerId'), {
          statusCode: 400,
          body: { general: 'Invalid partnerId' },
        }),
      );

      const response = await post(app, '/api/increaseFollower', { partnerId: 'bad' });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({ general: 'Invalid partnerId' });
    });

    it('возвращает 500 при неожиданной ошибке модели', async () => {
      increaseFollowerModelMock.mockRejectedValue(new Error('unexpected'));

      const response = await post(app, '/api/increaseFollower', { partnerId: 'partner-1' });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ general: 'unexpected' });
    });
  });
});
