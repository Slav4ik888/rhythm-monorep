// packages/backend/src/controllers/google/tests/google.controller.spec.ts
// Integration-тесты GoogleController (NestJS + Fastify, HTTP через app.inject)

import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { GoogleController } from '../google.controller';
import { googleGetDataModel } from '../../../models/google/handlers';
import { serviceGetCompany } from '../../../models/company';
import { admin } from '../../../libs/firebase/config/admin-sdk';

// Мокаем модель и зависимости — контроллер импортирует их напрямую (не через DI)
jest.mock('../../../models/google/handlers', () => ({ googleGetDataModel: jest.fn() }));
jest.mock('../../../models/company', () => ({ serviceGetCompany: jest.fn() }));
// Мокаем admin-sdk: в реальном модуле инициализируется Firebase Admin SDK.
// mockReturnValue возвращает один и тот же объект, поэтому verifySessionCookie доступен в тестах.
jest.mock('../../../libs/firebase/config/admin-sdk', () => ({
  admin: {
    auth: jest.fn().mockReturnValue({ verifySessionCookie: jest.fn() }),
  },
}));

const googleGetDataModelMock = googleGetDataModel as jest.Mock;
const serviceGetCompanyMock = serviceGetCompany as jest.Mock;
const verifySessionCookieMock = (admin as unknown as { auth: () => { verifySessionCookie: jest.Mock } }).auth()
  .verifySessionCookie;

// Контроллер логирует ошибки Google Apps Script через console.error (ожидаемо для кейса 502).
// Гасим вывод, чтобы не засорять отчёт прогона тестов.
jest.spyOn(console, 'error').mockImplementation(() => {});

const post = (app: NestFastifyApplication, url: string, payload: unknown, headers?: Record<string, string>) =>
  app.inject({
    method: 'POST',
    url,
    headers: { 'content-type': 'application/json', ...(headers || {}) },
    payload: payload as object,
  });

describe('GoogleController (integration)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GoogleController],
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

  describe('POST /api/getData', () => {
    it('возвращает данные, пропуская проверку доступа при отсутствии dashboardSheetId', async () => {
      googleGetDataModelMock.mockResolvedValue('csv,data');

      const response = await post(app, '/api/getData', { companyId: 'c1' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toBe('csv,data');
      expect(googleGetDataModelMock).toHaveBeenCalledWith({ companyId: 'c1' });
      expect(serviceGetCompanyMock).not.toHaveBeenCalled();
    });

    it('возвращает данные при публичном доступе к листу', async () => {
      serviceGetCompanyMock.mockResolvedValue({ dashboardPublicAccess: { sheet1: true } });
      googleGetDataModelMock.mockResolvedValue('csv,data');

      const body = { companyId: 'c1', dashboardSheetId: 'sheet1' };
      const response = await post(app, '/api/getData', body);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBe('csv,data');
      expect(googleGetDataModelMock).toHaveBeenCalledWith(body);
    });

    it('возвращает 401, если нет публичного доступа и нет session cookie', async () => {
      serviceGetCompanyMock.mockResolvedValue({});

      const response = await post(app, '/api/getData', { companyId: 'c1', dashboardSheetId: 'sheet1' });

      expect(response.statusCode).toBe(401);
      expect(response.json()).toEqual({ general: 'Пользователь не авторизован.' });
      expect(googleGetDataModelMock).not.toHaveBeenCalled();
    });

    it('возвращает данные при валидной session cookie', async () => {
      serviceGetCompanyMock.mockResolvedValue({});
      verifySessionCookieMock.mockResolvedValue({ uid: 'user-1' });
      googleGetDataModelMock.mockResolvedValue('csv,data');

      const response = await post(
        app,
        '/api/getData',
        { companyId: 'c1', dashboardSheetId: 'sheet1' },
        {
          cookie: 'rhythm=signature/sessionToken123',
        },
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toBe('csv,data');
      expect(verifySessionCookieMock).toHaveBeenCalledWith('sessionToken123', true);
      expect(googleGetDataModelMock).toHaveBeenCalledWith({ companyId: 'c1', dashboardSheetId: 'sheet1' });
    });

    it('пробрасывает 400 от модели', async () => {
      googleGetDataModelMock.mockRejectedValue(
        Object.assign(new Error('invalid companyId'), {
          statusCode: 400,
          body: { general: 'invalid companyId' },
        }),
      );

      const response = await post(app, '/api/getData', { companyId: 'c1' });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({ general: 'invalid companyId' });
    });

    it('возвращает 502 при ошибке Google Apps Script (axios)', async () => {
      googleGetDataModelMock.mockRejectedValue({ response: { status: 502 }, message: 'Bad Gateway' });

      const response = await post(app, '/api/getData', { companyId: 'c1' });

      expect(response.statusCode).toBe(502);
      expect(response.json()).toEqual({
        general: 'Не удалось получить данные из Google Таблицы. Проверьте корректность ссылки на таблицу.',
      });
    });
  });
});
