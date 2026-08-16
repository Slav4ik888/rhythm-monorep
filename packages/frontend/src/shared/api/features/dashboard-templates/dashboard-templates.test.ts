// packages/frontend/src/shared/api/features/dashboard-templates/dashboard-templates.test.ts

import { getTemplates, getTemplatesBunchesUpdated, updateTemplate, deleteTemplate } from './index';
import { api } from 'shared/api';
import { API_PATHS } from 'shared/api/api-paths';

jest.mock('axios', () => {
  const instance = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };

  return {
    __esModule: true,
    default: { create: jest.fn(() => instance) },
  };
});

describe('dashboard-templates api', () => {
  beforeEach(() => {
    (api.get as jest.Mock).mockReset();
    (api.post as jest.Mock).mockReset();
  });

  it('getTemplates: GET /templates/getTemplates?companyId=... и возвращает data', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: [{ id: 't1' }] });

    const res = await getTemplates({ companyId: 'company-1' });

    expect(api.get).toHaveBeenCalledWith(`${API_PATHS.templates.getTemplates}?companyId=company-1`);
    expect(res).toEqual([{ id: 't1' }]);
  });

  it('getTemplatesBunchesUpdated: GET /templates/getBunchesUpdated?companyId=...', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: { b1: 123 } });

    const res = await getTemplatesBunchesUpdated({ companyId: 'company-1' });

    expect(api.get).toHaveBeenCalledWith(`${API_PATHS.templates.getBunchesUpdated}?companyId=company-1`);
    expect(res).toEqual({ b1: 123 });
  });

  it('updateTemplate: POST /templates/update и возвращает data', async () => {
    const req = { id: 't1', companyId: 'company-1', template: { id: 't1' } };
    (api.post as jest.Mock).mockResolvedValue({ data: { template: { id: 't1' }, bunchUpdatedMs: 1, fullSet: false } });

    const res = await updateTemplate(req);

    expect(api.post).toHaveBeenCalledWith(API_PATHS.templates.update, req);
    expect(res).toEqual({ template: { id: 't1' }, bunchUpdatedMs: 1, fullSet: false });
  });

  it('deleteTemplate: POST /templates/delete с id и companyId', async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: { templateId: 't1', bunchUpdatedMs: 1, bunchId: 'b1' } });

    const res = await deleteTemplate({ id: 't1', companyId: 'company-1' });

    expect(api.post).toHaveBeenCalledWith(API_PATHS.templates.delete, { id: 't1', companyId: 'company-1' });
    expect(res).toEqual({ templateId: 't1', bunchUpdatedMs: 1, bunchId: 'b1' });
  });
});
