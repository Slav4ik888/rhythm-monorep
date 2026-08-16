// packages/backend/src/controllers/docs/tests/docs.controller.spec.ts
// Integration-тесты DocsController (NestJS + Fastify, HTTP через app.inject)

import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
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
      // Большой лимит + мок guard: здесь проверяется бизнес-логика, а не rate limiting (отдельный describe ниже).
      imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 1000 }])],
      controllers: [DocsController],
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

describe('DocsController — rate limiting (429)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    // Маленький лимит + реальный ThrottlerGuard (без override) — проверяем 429.
    const moduleRef = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 2 }])],
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

  it('GET /api/getPolicy: превышение лимита (2) → 429', async () => {
    getPolicyModelMock.mockResolvedValue({ policy: '# Политика' });

    const responses = [];
    for (let i = 0; i < 3; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      responses.push(await get(app, '/api/getPolicy'));
    }

    expect(responses[0].statusCode).toBe(200);
    expect(responses[1].statusCode).toBe(200);
    expect(responses[2].statusCode).toBe(429);
  });
});
