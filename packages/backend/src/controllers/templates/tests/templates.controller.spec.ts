// packages/backend/src/controllers/templates/tests/templates.controller.spec.ts
// Integration-тесты TemplatesController (NestJS + Fastify, HTTP через app.inject)

import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { TemplatesController } from '../templates.controller';
import { getBunchesUpdatedModel } from '../../../models/templates/handlers/get-bunches-updated';
import { getTemplatesModel } from '../../../models/templates/handlers/get-templates';
import { updateTemplateModel } from '../../../models/templates/handlers/update';
import { deleteTemlateModel } from '../../../models/templates/handlers/delete';

// Мокаем модели — контроллер импортирует их напрямую (не через DI)
jest.mock('../../../models/templates/handlers/get-bunches-updated', () => ({
  getBunchesUpdatedModel: jest.fn(),
}));
jest.mock('../../../models/templates/handlers/get-templates', () => ({ getTemplatesModel: jest.fn() }));
jest.mock('../../../models/templates/handlers/update', () => ({ updateTemplateModel: jest.fn() }));
jest.mock('../../../models/templates/handlers/delete', () => ({ deleteTemlateModel: jest.fn() }));

const getBunchesUpdatedModelMock = getBunchesUpdatedModel as jest.Mock;
const getTemplatesModelMock = getTemplatesModel as jest.Mock;
const updateTemplateModelMock = updateTemplateModel as jest.Mock;
const deleteTemlateModelMock = deleteTemlateModel as jest.Mock;

const get = (app: NestFastifyApplication, url: string) => app.inject({ method: 'GET', url });

const post = (app: NestFastifyApplication, url: string, payload: unknown) =>
  app.inject({
    method: 'POST',
    url,
    headers: { 'content-type': 'application/json' },
    payload: payload as object,
  });

describe('TemplatesController (integration)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TemplatesController],
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

  describe('GET /api/templates/getBunchesUpdated (публичный)', () => {
    it('возвращает обновлённые группы шаблонов', async () => {
      const bunchesUpdated = { b1: 123 };
      getBunchesUpdatedModelMock.mockResolvedValue(bunchesUpdated);

      const response = await get(app, '/api/templates/getBunchesUpdated');

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(bunchesUpdated);
      expect(getBunchesUpdatedModelMock).toHaveBeenCalledTimes(1);
    });

    it('возвращает 500 при неожиданной ошибке модели', async () => {
      getBunchesUpdatedModelMock.mockRejectedValue(new Error('unexpected'));

      const response = await get(app, '/api/templates/getBunchesUpdated');

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({ general: 'unexpected' });
    });
  });

  describe('POST /api/templates/getTemplates', () => {
    it('возвращает шаблоны по bunchIds', async () => {
      const templates = [{ id: 't1' }];
      const bunchesUpdated = { b1: 123 };
      getTemplatesModelMock.mockResolvedValue({ templates, bunchesUpdated });

      const body = { bunchIds: ['b1'] };
      const response = await post(app, '/api/templates/getTemplates', body);

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ templates, bunchesUpdated });
      expect(getTemplatesModelMock).toHaveBeenCalledWith(body);
    });

    it('пробрасывает 400 от модели (нет bunchIds)', async () => {
      getTemplatesModelMock.mockRejectedValue(
        Object.assign(new Error('Не переданы bunchIds'), {
          statusCode: 400,
          body: { general: 'Не переданы bunchIds' },
        }),
      );

      const response = await post(app, '/api/templates/getTemplates', {});

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({ general: 'Не переданы bunchIds' });
    });
  });

  describe('POST /api/templates/update', () => {
    it('обновляет шаблон, подставляя userId по умолчанию system', async () => {
      const template = { id: 't1', type: 'chart' };
      const body = { bunchUpdatedMs: 123, template, bunchAction: 'add' };
      updateTemplateModelMock.mockResolvedValue(body);

      const response = await post(app, '/api/templates/update', body);

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(body);
      // userId не был передан в body → используется значение по умолчанию 'system'
      expect(updateTemplateModelMock).toHaveBeenCalledWith({ ...body, userId: 'system' });
    });

    it('пробрасывает userId из body', async () => {
      const template = { id: 't1', type: 'chart' };
      const body = { bunchUpdatedMs: 123, template, bunchAction: 'add', userId: 'user-1' };
      updateTemplateModelMock.mockResolvedValue({ bunchUpdatedMs: 123, template, bunchAction: 'add' });

      const response = await post(app, '/api/templates/update', body);

      expect(response.statusCode).toBe(200);
      // userId из body подставляется в модель, но не уходит в возвращаемое значение
      expect(updateTemplateModelMock).toHaveBeenCalledWith({
        bunchUpdatedMs: 123,
        template,
        bunchAction: 'add',
        userId: 'user-1',
      });
    });

    it('пробрасывает 400 от модели (invalid body required field)', async () => {
      updateTemplateModelMock.mockRejectedValue(
        Object.assign(new Error('invalid body required field'), { statusCode: 400 }),
      );

      const response = await post(app, '/api/templates/update', {
        bunchUpdatedMs: 0,
        template: null,
        bunchAction: '',
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /api/templates/delete', () => {
    it('удаляет шаблон и возвращает его данные', async () => {
      const body = { bunchUpdatedMs: 123, templateId: 't1', bunchId: 'b1' };
      deleteTemlateModelMock.mockResolvedValue(body);

      const response = await post(app, '/api/templates/delete', body);

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(body);
      expect(deleteTemlateModelMock).toHaveBeenCalledWith(body);
    });

    it('пробрасывает 400 от модели (invalid body required field)', async () => {
      deleteTemlateModelMock.mockRejectedValue(
        Object.assign(new Error('invalid body required field'), { statusCode: 400 }),
      );

      const response = await post(app, '/api/templates/delete', {
        bunchUpdatedMs: 0,
        templateId: '',
        bunchId: '',
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
