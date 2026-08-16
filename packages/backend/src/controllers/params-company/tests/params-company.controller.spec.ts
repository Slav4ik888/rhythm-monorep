// packages/backend/src/controllers/params-company/tests/params-company.controller.spec.ts
// Integration-тесты ParamsCompanyController (NestJS + Fastify, HTTP через app.inject)

import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ParamsCompanyController } from '../params-company.controller';
import { getParamsCompanyModel } from '../../../models/params-company/handlers/get';

// Мокаем модель — контроллер импортирует её напрямую (не через DI)
jest.mock('../../../models/params-company/handlers/get', () => ({ getParamsCompanyModel: jest.fn() }));

const getParamsCompanyModelMock = getParamsCompanyModel as jest.Mock;

const get = (app: NestFastifyApplication, url: string) => app.inject({ method: 'GET', url });

const post = (app: NestFastifyApplication, url: string, payload: unknown) =>
  app.inject({
    method: 'POST',
    url,
    headers: { 'content-type': 'application/json' },
    payload: payload as object,
  });

describe('ParamsCompanyController (integration)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      // Большой лимит + мок guard: здесь проверяется бизнес-логика, а не rate limiting (отдельный describe ниже).
      imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 1000 }])],
      controllers: [ParamsCompanyController],
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

  describe('GET /api/paramsCompany/get (публичный)', () => {
    it('возвращает параметры компании по query-параметрам', async () => {
      const company = { id: 'c1', companyName: 'Test' };
      getParamsCompanyModelMock.mockResolvedValue(company);

      const response = await get(app, '/api/paramsCompany/get?companyId=c1&dashboardSheetId=s1');

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(company);
      expect(getParamsCompanyModelMock).toHaveBeenCalledWith({ companyId: 'c1', dashboardSheetId: 's1' });
    });

    it('пробрасывает 400 от модели (нет companyId)', async () => {
      getParamsCompanyModelMock.mockRejectedValue(
        Object.assign(new Error('Invalid companyId'), {
          statusCode: 400,
          body: { general: 'Invalid companyId' },
        }),
      );

      const response = await get(app, '/api/paramsCompany/get?companyId=');

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({ general: 'Invalid companyId' });
    });
  });

  describe('POST /api/paramsCompany/get (публичный)', () => {
    it('возвращает параметры компании по body', async () => {
      const company = { id: 'c1', companyName: 'Test' };
      getParamsCompanyModelMock.mockResolvedValue(company);

      const body = { companyId: 'c1', dashboardSheetId: 's1' };
      const response = await post(app, '/api/paramsCompany/get', body);

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(company);
      expect(getParamsCompanyModelMock).toHaveBeenCalledWith(body);
    });

    it('пробрасывает 400 от модели', async () => {
      getParamsCompanyModelMock.mockRejectedValue(
        Object.assign(new Error('Invalid companyId'), {
          statusCode: 400,
          body: { general: 'Invalid companyId' },
        }),
      );

      const response = await post(app, '/api/paramsCompany/get', { companyId: '' });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({ general: 'Invalid companyId' });
    });
  });
});

describe('ParamsCompanyController — rate limiting (429)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    // Маленький лимит + реальный ThrottlerGuard (без override) — проверяем 429.
    const moduleRef = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 2 }])],
      controllers: [ParamsCompanyController],
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

  it('GET /api/paramsCompany/get: превышение лимита (2) → 429', async () => {
    getParamsCompanyModelMock.mockResolvedValue({ id: 'c1', companyName: 'Test' });

    const responses = [];
    for (let i = 0; i < 3; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      responses.push(await get(app, '/api/paramsCompany/get?companyId=c1'));
    }

    expect(responses[0].statusCode).toBe(200);
    expect(responses[1].statusCode).toBe(200);
    expect(responses[2].statusCode).toBe(429);
  });
});
