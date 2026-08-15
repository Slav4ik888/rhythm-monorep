// packages/backend/src/controllers/company/tests/company.controller.spec.ts
// Integration-тесты CompanyController (NestJS + Fastify, HTTP через app.inject)

import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { UnauthorizedException } from '@nestjs/common';
import { CompanyController } from '../company.controller';
import { FirebaseAuthGuard } from '../../../guards/firebase-auth.guard';
import { updateCompanyModel } from '../../../models/company/handlers/update';
import { companyDeleteSheetModel } from '../../../models/company/handlers/delete-sheet';

// Мокаем модели — контроллер импортирует их напрямую (не через DI)
jest.mock('../../../models/company/handlers/update', () => ({ updateCompanyModel: jest.fn() }));
jest.mock('../../../models/company/handlers/delete-sheet', () => ({
  companyDeleteSheetModel: jest.fn(),
}));
// Мокаем guard (пустой класс-токен): реальный guard тянет за собой models → redis,
// что оставляет открытый handle и вешает завершение jest. Поведение задаём через overrideGuard.
jest.mock('../../../guards/firebase-auth.guard', () => ({
  FirebaseAuthGuard: class FirebaseAuthGuard {},
}));

const updateCompanyModelMock = updateCompanyModel as jest.Mock;
const companyDeleteSheetModelMock = companyDeleteSheetModel as jest.Mock;

const post = (app: NestFastifyApplication, url: string, payload: unknown) =>
  app.inject({
    method: 'POST',
    url,
    headers: { 'content-type': 'application/json' },
    payload: payload as object,
  });

// Guard-заглушка: «аутентифицированный» пользователь с id user-1
const authGuardOk = {
  canActivate: (context) => {
    context.switchToHttp().getRequest().user = { id: 'user-1' };
    return true;
  },
};

describe('CompanyController (integration)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CompanyController],
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

  describe('POST /api/company/update', () => {
    it('возвращает обновлённые данные компании', async () => {
      const companyData = { id: 'c1', companyName: 'Updated' };
      updateCompanyModelMock.mockResolvedValue(companyData);

      const response = await post(app, '/api/company/update', { companyData });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(companyData);
      expect(updateCompanyModelMock).toHaveBeenCalledWith({
        companyData,
        userId: 'user-1',
      });
    });

    it('пробрасывает 400 от модели', async () => {
      updateCompanyModelMock.mockRejectedValue(
        Object.assign(new Error('Invalid data'), {
          statusCode: 400,
          body: { general: 'Неверные данные компании' },
        }),
      );

      const response = await post(app, '/api/company/update', { companyData: {} });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({ general: 'Неверные данные компании' });
    });

    it('возвращает 500 при неожиданной ошибке модели', async () => {
      updateCompanyModelMock.mockRejectedValue(new Error('unexpected'));

      const response = await post(app, '/api/company/update', { companyData: {} });

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ general: 'unexpected' });
    });
  });

  describe('POST /api/company/deleteSheet', () => {
    it('возвращает body при успешном удалении листа', async () => {
      companyDeleteSheetModelMock.mockResolvedValue(undefined);

      const body = { companyId: 'c1', sheetId: 's1' };
      const response = await post(app, '/api/company/deleteSheet', body);

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(body);
      expect(companyDeleteSheetModelMock).toHaveBeenCalledWith({
        companyId: 'c1',
        sheetId: 's1',
        userId: 'user-1',
      });
    });

    it('пробрасывает 400 от модели', async () => {
      companyDeleteSheetModelMock.mockRejectedValue(
        Object.assign(new Error('Нельзя удалить вкладку, пока есть вложенные элементы'), {
          statusCode: 400,
          body: { general: 'Нельзя удалить вкладку, пока есть вложенные элементы' },
        }),
      );

      const response = await post(app, '/api/company/deleteSheet', {
        companyId: 'c1',
        sheetId: 's1',
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({
        general: 'Нельзя удалить вкладку, пока есть вложенные элементы',
      });
    });
  });
});

describe('CompanyController — защита FirebaseAuthGuard', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CompanyController],
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

  it('возвращает 401 без валидной сессии', async () => {
    const response = await post(app, '/api/company/update', { companyData: {} });
    expect(response.statusCode).toBe(401);
  });
});
