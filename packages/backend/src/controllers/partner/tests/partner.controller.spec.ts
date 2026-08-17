// packages/backend/src/controllers/partner/tests/partner.controller.spec.ts
// Integration-тесты PartnerController (NestJS + Fastify, HTTP через app.inject)

import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
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
      // Большой лимит + мок guard: здесь проверяется бизнес-логика, а не rate limiting (отдельный describe ниже).
      imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 1000 }])],
      controllers: [PartnerController],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

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

describe('PartnerController — rate limiting (429)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    // Маленький лимит + реальный ThrottlerGuard (без override) — проверяем 429.
    const moduleRef = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 2 }])],
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

  it('POST /api/increaseFollower: превышение лимита (2) → 429', async () => {
    increaseFollowerModelMock.mockResolvedValue(undefined);

    const responses = [];
    for (let i = 0; i < 3; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      responses.push(await post(app, '/api/increaseFollower', { partnerId: 'partner-1' }));
    }

    expect(responses[0].statusCode).toBe(200);
    expect(responses[1].statusCode).toBe(200);
    expect(responses[2].statusCode).toBe(429);
  });
});
