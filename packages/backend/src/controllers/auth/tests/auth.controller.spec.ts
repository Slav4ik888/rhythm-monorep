// packages/backend/src/controllers/auth/tests/auth.controller.spec.ts
// Integration-тесты AuthController (NestJS + Fastify, HTTP через app.inject)

import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from '../auth.controller';
import { loginModel } from '../../../models/auth/login';
import { signupByEmailStartModel } from '../../../models/auth/signup/handlers/by-email-start';
import { signupByEmailEndModel } from '../../../models/auth/signup/handlers/by-email-end';
import { signupSendCodeModel } from '../../../models/auth/signup/handlers/by-email-start/send-code';
import { resetEmailPasswordModel } from '../../../models/auth/reset-email-password';
import { setCookieFastify } from '../../../libs/firebase/auth/set-cookie-fastify';

// Мокаем модели — контроллер импортирует их напрямую (не через DI)
jest.mock('../../../models/auth/login', () => ({ loginModel: jest.fn() }));
jest.mock('../../../models/auth/signup/handlers/by-email-start', () => ({
  signupByEmailStartModel: jest.fn(),
}));
jest.mock('../../../models/auth/signup/handlers/by-email-end', () => ({
  signupByEmailEndModel: jest.fn(),
}));
jest.mock('../../../models/auth/signup/handlers/by-email-start/send-code', () => ({
  signupSendCodeModel: jest.fn(),
}));
jest.mock('../../../models/auth/reset-email-password', () => ({ resetEmailPasswordModel: jest.fn() }));
jest.mock('../../../libs/firebase/auth/set-cookie-fastify', () => ({ setCookieFastify: jest.fn() }));

const loginModelMock = loginModel as jest.Mock;
const signupByEmailStartModelMock = signupByEmailStartModel as jest.Mock;
const signupByEmailEndModelMock = signupByEmailEndModel as jest.Mock;
const signupSendCodeModelMock = signupSendCodeModel as jest.Mock;
const resetEmailPasswordModelMock = resetEmailPasswordModel as jest.Mock;
const setCookieFastifyMock = setCookieFastify as jest.Mock;

const post = (app: NestFastifyApplication, url: string, payload: unknown) =>
  app.inject({
    method: 'POST',
    url,
    headers: { 'content-type': 'application/json' },
    payload: payload as object,
  });

// Последовательные запросы (важно для rate limiting: порядок определяет накопление счётчика).
const postSequentially = async (app: NestFastifyApplication, url: string, payload: unknown, count: number) => {
  const responses = [];
  for (let i = 0; i < count; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    responses.push(await post(app, url, payload));
  }
  return responses;
};

describe('AuthController (integration)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      // Большой лимит + мок guard: в этом блоке проверяется бизнес-логика,
      // а не rate limiting (он покрыт отдельным describe ниже).
      imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 1000 }])],
      controllers: [AuthController],
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

  describe('POST /api/auth/login/byEmail', () => {
    it('возвращает user, company и message при успешном входе', async () => {
      const user = { id: 'u1', email: 'korzan.va@mail.ru' };
      const company = { id: 'c1', companyName: 'Test' };

      loginModelMock.mockResolvedValue({
        user,
        company,
        userCredential: { user: { getIdToken: jest.fn() } },
        message: 'Login is successfully!',
      });
      setCookieFastifyMock.mockResolvedValue(undefined);

      const response = await post(app, '/api/auth/login/byEmail', {
        authByLogin: { email: 'korzan.va@mail.ru', password: 'secret' },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ user, company, message: 'Login is successfully!' });
      expect(loginModelMock).toHaveBeenCalledWith({
        authByLogin: { email: 'korzan.va@mail.ru', password: 'secret' },
      });
      expect(setCookieFastifyMock).toHaveBeenCalledTimes(1);
    });

    it('пробрасывает 400 от модели (неверная почта или пароль)', async () => {
      loginModelMock.mockRejectedValue(
        Object.assign(new Error('Invalid credentials'), {
          statusCode: 400,
          body: { general: 'Неверная почта или пароль' },
        }),
      );

      const response = await post(app, '/api/auth/login/byEmail', {
        authByLogin: { email: 'korzan.va@mail.ru', password: 'wrong' },
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({ general: 'Неверная почта или пароль' });
    });

    it('возвращает 500 при неожиданной ошибке модели', async () => {
      loginModelMock.mockRejectedValue(new Error('unexpected'));

      const response = await post(app, '/api/auth/login/byEmail', {
        authByLogin: { email: 'korzan.va@mail.ru', password: 'secret' },
      });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ general: 'unexpected' });
    });
  });

  describe('POST /api/auth/signup/byEmailStart', () => {
    it('возвращает message при успешном старте регистрации', async () => {
      signupByEmailStartModelMock.mockResolvedValue({ message: 'code sent' });

      const response = await post(app, '/api/auth/signup/byEmailStart', {
        signupData: { email: 'new@mail.ru' },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ message: 'code sent' });
      expect(signupByEmailStartModelMock).toHaveBeenCalledWith({
        signupData: { email: 'new@mail.ru' },
      });
    });

    it('пробрасывает 400 от модели', async () => {
      signupByEmailStartModelMock.mockRejectedValue(
        Object.assign(new Error('Invalid data'), {
          statusCode: 400,
          body: { general: 'Неверные данные' },
        }),
      );

      const response = await post(app, '/api/auth/signup/byEmailStart', {
        signupData: { email: 'bad' },
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({ general: 'Неверные данные' });
    });
  });

  describe('POST /api/auth/signup/sendCodeAgain', () => {
    it('возвращает message при повторной отправке кода', async () => {
      signupSendCodeModelMock.mockResolvedValue({ message: 'code sent' });

      const response = await post(app, '/api/auth/signup/sendCodeAgain', {
        signupData: { email: 'new@mail.ru' },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ message: 'code sent' });
      expect(signupSendCodeModelMock).toHaveBeenCalledWith({
        signupData: { email: 'new@mail.ru' },
      });
    });
  });

  describe('POST /api/auth/signup/byEmailEnd', () => {
    it('возвращает данные пользователя и компании при успешной регистрации', async () => {
      const newUserData = { id: 'u1', email: 'new@mail.ru' };
      const newCompanyData = { id: 'c1', companyName: 'Test' };

      signupByEmailEndModelMock.mockResolvedValue({
        newUserData,
        newCompanyData,
        userCredential: { user: { getIdToken: jest.fn() } },
        message: 'Поздравляем с успешной регистрацией!',
      });
      setCookieFastifyMock.mockResolvedValue(undefined);

      const response = await post(app, '/api/auth/signup/byEmailEnd', {
        signupDataEnd: { email: 'new@mail.ru', emailCode: '1234' },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        newUserData,
        newCompanyData,
        message: 'Поздравляем с успешной регистрацией!',
      });
      expect(setCookieFastifyMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/auth/login/resetEmailPassword', () => {
    it('возвращает success при успешном сбросе пароля', async () => {
      resetEmailPasswordModelMock.mockResolvedValue({
        success: true,
        message: 'Ссылка для восстановления пароля отправлена на почту: a@b.c',
      });

      const response = await post(app, '/api/auth/login/resetEmailPassword', {
        email: 'a@b.c',
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        success: true,
        message: 'Ссылка для восстановления пароля отправлена на почту: a@b.c',
      });
    });

    it('возвращает 400, если модель вернула success: false', async () => {
      resetEmailPasswordModelMock.mockResolvedValue({
        success: false,
        message: 'Произошла ошибка, не получилось отправить ссылку, на указанную почту: a@b.c',
      });

      const response = await post(app, '/api/auth/login/resetEmailPassword', {
        email: 'a@b.c',
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({
        success: false,
        message: 'Произошла ошибка, не получилось отправить ссылку, на указанную почту: a@b.c',
      });
    });

    it('пробрасывает 400 от модели', async () => {
      resetEmailPasswordModelMock.mockRejectedValue(
        Object.assign(new Error('Invalid data'), {
          statusCode: 400,
          body: { general: 'Неверная почта' },
        }),
      );

      const response = await post(app, '/api/auth/login/resetEmailPassword', {
        email: 'bad',
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({ general: 'Неверная почта' });
    });
  });
});

describe('AuthController — rate limiting (429)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    // Маленький лимит + реальный ThrottlerGuard (без override) — проверяем 429.
    const moduleRef = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 2 }])],
      controllers: [AuthController],
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

  it('signup/byEmailStart: превышение дефолтного лимита (2) → 429', async () => {
    signupByEmailStartModelMock.mockResolvedValue({ message: 'ok' });

    const responses = await postSequentially(
      app,
      '/api/auth/signup/byEmailStart',
      { signupData: { email: 'new@mail.ru' } },
      3,
    );

    expect(responses[0].statusCode).toBe(200);
    expect(responses[1].statusCode).toBe(200);
    expect(responses[2].statusCode).toBe(429);
  });

  it('login/byEmail: лимит переопределён @Throttle (5), 6-й запрос → 429', async () => {
    loginModelMock.mockResolvedValue({
      user: { id: 'u1', email: 'korzan.va@mail.ru' },
      company: { id: 'c1', companyName: 'Test' },
      userCredential: { user: { getIdToken: jest.fn() } },
      message: 'Login is successfully!',
    });
    setCookieFastifyMock.mockResolvedValue(undefined);

    const responses = await postSequentially(
      app,
      '/api/auth/login/byEmail',
      { authByLogin: { email: 'korzan.va@mail.ru', password: 'secret' } },
      6,
    );

    expect(responses[4].statusCode).toBe(200);
    expect(responses[5].statusCode).toBe(429);
  });
});
