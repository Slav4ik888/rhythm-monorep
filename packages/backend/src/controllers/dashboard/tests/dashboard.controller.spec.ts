// packages/backend/src/controllers/dashboard/tests/dashboard.controller.spec.ts
// Integration-тесты DashboardController (NestJS + Fastify, HTTP через app.inject)

import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { UnauthorizedException } from '@nestjs/common';
import { DashboardController } from '../dashboard.controller';
import { FirebaseAuthGuard } from '../../../guards/firebase-auth.guard';
import { getBunchesModel } from '../../../models/dashboard-view/handlers-bunch/get';
import { createGroupViewItemsModel } from '../../../models/dashboard-view/handlers-view/create-group-items';
import { updateGroupViewItemsModel } from '../../../models/dashboard-view/handlers-view/update';
import { deleteViewItemModel } from '../../../models/dashboard-view/handlers-view/delete';

// Мокаем модели — контроллер импортирует их напрямую (не через DI)
jest.mock('../../../models/dashboard-view/handlers-bunch/get', () => ({ getBunchesModel: jest.fn() }));
jest.mock('../../../models/dashboard-view/handlers-view/create-group-items', () => ({
  createGroupViewItemsModel: jest.fn(),
}));
jest.mock('../../../models/dashboard-view/handlers-view/update', () => ({
  updateGroupViewItemsModel: jest.fn(),
}));
jest.mock('../../../models/dashboard-view/handlers-view/delete', () => ({
  deleteViewItemModel: jest.fn(),
}));
// Мокаем guard (пустой класс-токен), чтобы не тянуть models → redis (открытый handle)
jest.mock('../../../guards/firebase-auth.guard', () => ({
  FirebaseAuthGuard: class FirebaseAuthGuard {},
}));

const getBunchesModelMock = getBunchesModel as jest.Mock;
const createGroupViewItemsModelMock = createGroupViewItemsModel as jest.Mock;
const updateGroupViewItemsModelMock = updateGroupViewItemsModel as jest.Mock;
const deleteViewItemModelMock = deleteViewItemModel as jest.Mock;

const post = (app: NestFastifyApplication, url: string, payload: unknown) =>
  app.inject({
    method: 'POST',
    url,
    headers: { 'content-type': 'application/json' },
    payload: payload as object,
  });

const patch = (app: NestFastifyApplication, url: string, payload: unknown) =>
  app.inject({
    method: 'PATCH',
    url,
    headers: { 'content-type': 'application/json' },
    payload: payload as object,
  });

const authGuardOk = {
  canActivate: (context) => {
    context.switchToHttp().getRequest().user = { id: 'user-1' };
    return true;
  },
};

describe('DashboardController (integration)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [DashboardController],
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

  describe('POST /api/dashboard/bunch/get (публичный)', () => {
    it('возвращает bunches по companyId', async () => {
      const bunches = { b1: { id: 'b1' } };
      getBunchesModelMock.mockResolvedValue({ bunches });

      const body = { companyId: 'c1', bunchIds: ['b1'], dashboardSheetId: undefined };
      const response = await post(app, '/api/dashboard/bunch/get', body);

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ bunches });
      expect(getBunchesModelMock).toHaveBeenCalledWith(body);
    });

    it('пробрасывает 400 от модели', async () => {
      getBunchesModelMock.mockRejectedValue(
        Object.assign(new Error('Invalid data'), {
          statusCode: 400,
          body: { general: 'Неверные данные' },
        }),
      );

      const response = await post(app, '/api/dashboard/bunch/get', { companyId: '' });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({ general: 'Неверные данные' });
    });
  });

  describe('POST /api/dashboard/view/createGroupItems', () => {
    it('создаёт элементы дашборда', async () => {
      const body = {
        bunchUpdatedMs: 123,
        companyId: 'c1',
        viewItems: [{ id: 'v1' }],
        bunchAction: 'add',
      };
      createGroupViewItemsModelMock.mockResolvedValue(body);

      const response = await post(app, '/api/dashboard/view/createGroupItems', body);

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(body);
      expect(createGroupViewItemsModelMock).toHaveBeenCalledWith({ ...body, userId: 'user-1' });
    });

    it('пробрасывает 400 от модели', async () => {
      createGroupViewItemsModelMock.mockRejectedValue(
        Object.assign(new Error('invalid body required field'), { statusCode: 400 }),
      );

      const response = await post(app, '/api/dashboard/view/createGroupItems', {
        bunchUpdatedMs: 0,
        companyId: '',
        viewItems: [],
        bunchAction: '',
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('PATCH /api/dashboard/view/update', () => {
    it('обновляет элементы дашборда', async () => {
      const body = { bunchUpdatedMs: 123, companyId: 'c1', viewItems: [{ id: 'v1', bunchId: 'b1' }] };
      updateGroupViewItemsModelMock.mockResolvedValue(body);

      const response = await patch(app, '/api/dashboard/view/update', body);

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(body);
      expect(updateGroupViewItemsModelMock).toHaveBeenCalledWith({ ...body, userId: 'user-1' });
    });

    it('пробрасывает 400 от модели', async () => {
      updateGroupViewItemsModelMock.mockRejectedValue(
        Object.assign(new Error('invalid body required field'), { statusCode: 400 }),
      );

      const response = await patch(app, '/api/dashboard/view/update', {
        bunchUpdatedMs: 0,
        companyId: '',
        viewItems: [],
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /api/dashboard/view/delete', () => {
    it('удаляет элементы дашборда и возвращает пустой объект', async () => {
      deleteViewItemModelMock.mockResolvedValue(undefined);

      const body = { bunchUpdatedMs: 123, companyId: 'c1', viewItems: [{ id: 'v1' }] };
      const response = await post(app, '/api/dashboard/view/delete', body);

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({});
      expect(deleteViewItemModelMock).toHaveBeenCalledWith({ ...body, userId: 'user-1' });
    });

    it('пробрасывает 400 от модели', async () => {
      deleteViewItemModelMock.mockRejectedValue(
        Object.assign(new Error('invalid body required field'), { statusCode: 400 }),
      );

      const response = await post(app, '/api/dashboard/view/delete', {
        bunchUpdatedMs: 0,
        companyId: '',
        viewItems: [],
      });

      expect(response.statusCode).toBe(400);
    });
  });
});

describe('DashboardController — защита FirebaseAuthGuard', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [DashboardController],
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

  it('возвращает 401 для защищённого эндпоинта без сессии', async () => {
    const response = await patch(app, '/api/dashboard/view/update', {
      bunchUpdatedMs: 123,
      companyId: 'c1',
      viewItems: [],
    });
    expect(response.statusCode).toBe(401);
  });
});
