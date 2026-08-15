// packages/backend/src/controllers/user/tests/user.controller.spec.ts
// Integration-тесты UserController (NestJS + Fastify, HTTP через app.inject)

import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { UnauthorizedException } from '@nestjs/common';
import { UserController } from '../user.controller';
import { FirebaseAuthGuard } from '../../../guards/firebase-auth.guard';
import { getAuthModel } from '../../../models/user/handlers/get-auth';
import { updateUserModel } from '../../../models/user/handlers/update';

// Мокаем модели — контроллер импортирует их напрямую (не через DI)
jest.mock('../../../models/user/handlers/get-auth', () => ({ getAuthModel: jest.fn() }));
jest.mock('../../../models/user/handlers/update', () => ({ updateUserModel: jest.fn() }));
// Мокаем guard (пустой класс-токен), чтобы не тянуть models → redis (открытый handle)
jest.mock('../../../guards/firebase-auth.guard', () => ({
  FirebaseAuthGuard: class FirebaseAuthGuard {},
}));

const getAuthModelMock = getAuthModel as jest.Mock;
const updateUserModelMock = updateUserModel as jest.Mock;

const get = (app: NestFastifyApplication, url: string) => app.inject({ method: 'GET', url });

const post = (app: NestFastifyApplication, url: string, payload: unknown) =>
  app.inject({
    method: 'POST',
    url,
    headers: { 'content-type': 'application/json' },
    payload: payload as object,
  });

// Guard-заглушка: «аутентифицированный» пользователь
const authGuardOk = {
  canActivate: (context) => {
    context.switchToHttp().getRequest().user = { id: 'user-1', companyId: 'company-1' };
    return true;
  },
};

describe('UserController (integration)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue(authGuardOk)
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

  describe('GET /api/user/getAuth', () => {
    it('возвращает данные пользователя и компании', async () => {
      const userData = { id: 'user-1', email: 'korzan.va@mail.ru' };
      const companyData = { id: 'company-1', companyName: 'Test' };
      getAuthModelMock.mockResolvedValue({ userData, companyData });

      const response = await get(app, '/api/user/getAuth');

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ userData, companyData });
      expect(getAuthModelMock).toHaveBeenCalledWith({ userId: 'user-1', companyId: 'company-1' });
    });

    it('пробрасывает 400 от модели', async () => {
      getAuthModelMock.mockRejectedValue(
        Object.assign(new Error('Invalid data'), { statusCode: 400, body: { general: 'Неверные данные' } }),
      );

      const response = await get(app, '/api/user/getAuth');

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({ general: 'Неверные данные' });
    });

    it('возвращает 500 при неожиданной ошибке модели', async () => {
      getAuthModelMock.mockRejectedValue(new Error('unexpected'));

      const response = await get(app, '/api/user/getAuth');

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ general: 'unexpected' });
    });
  });

  describe('POST /api/user/update', () => {
    it('обновляет данные пользователя и возвращает success', async () => {
      updateUserModelMock.mockResolvedValue(undefined);

      const userData = { email: 'new@mail.ru' };
      const response = await post(app, '/api/user/update', { userData });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ success: true });
      expect(updateUserModelMock).toHaveBeenCalledWith({ userData, userId: 'user-1' });
    });

    it('пробрасывает 400 от модели', async () => {
      updateUserModelMock.mockRejectedValue(
        Object.assign(new Error('Invalid data'), { statusCode: 400, body: { general: 'Неверные данные' } }),
      );

      const response = await post(app, '/api/user/update', { userData: {} });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({ general: 'Неверные данные' });
    });

    it('возвращает 500 при неожиданной ошибке модели', async () => {
      updateUserModelMock.mockRejectedValue(new Error('unexpected'));

      const response = await post(app, '/api/user/update', { userData: {} });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ general: 'unexpected' });
    });
  });

  describe('POST /api/user/logout (публичный)', () => {
    it('очищает cookie и редиректит на главную', async () => {
      const response = await post(app, '/api/user/logout', {});

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe('/');
      expect(response.headers['set-cookie']).toBe('rhythm=; Path=/; Max-Age=0');
    });
  });
});

describe('UserController — защита FirebaseAuthGuard', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({
        canActivate: () => {
          throw new UnauthorizedException('Session verification failed');
        },
      })
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('возвращает 401 для /api/user/getAuth без сессии', async () => {
    const response = await get(app, '/api/user/getAuth');
    expect(response.statusCode).toBe(401);
  });

  it('возвращает 401 для /api/user/update без сессии', async () => {
    const response = await post(app, '/api/user/update', { userData: {} });
    expect(response.statusCode).toBe(401);
  });
});
