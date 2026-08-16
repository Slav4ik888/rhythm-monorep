// packages/frontend/src/shared/api/features/company/company.test.ts

import { getParamsCompany, updateCompany, deleteSheet } from './index';
import { api } from 'shared/api';
import { API_PATHS } from 'shared/api/api-paths';
import { useCompanyStore } from 'entities/company';
import { useUIStore } from 'entities/ui';

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

jest.mock('entities/company', () => {
  const state = {
    startLoading: jest.fn(),
    finishGetParamsCompany: jest.fn(),
    failGetParamsCompany: jest.fn(),
    finishUpdateCompany: jest.fn(),
    failUpdateCompany: jest.fn(),
    finishDeleteSheet: jest.fn(),
    failDeleteSheet: jest.fn(),
  };

  return {
    useCompanyStore: { getState: () => state },
  };
});

jest.mock('entities/ui', () => {
  const state = {
    setErrorStatus: jest.fn(),
    setPageLoading: jest.fn(),
  };

  return {
    useUIStore: { getState: () => state },
  };
});

const companyState = useCompanyStore.getState() as unknown as Record<string, jest.Mock>;
const uiState = useUIStore.getState() as unknown as Record<string, jest.Mock>;

describe('company api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getParamsCompany', () => {
    it('получает параметры компании и обновляет стор', async () => {
      const data = { id: 'company-1', name: 'Компания' };
      (api.get as jest.Mock).mockResolvedValue({ data });

      const res = await getParamsCompany({ companyId: 'company-1', dashboardSheetId: 'sheet-1' });

      expect(companyState.startLoading).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith(
        `${API_PATHS.paramsCompany.get}?companyId=company-1&dashboardSheetId=sheet-1`,
      );
      expect(companyState.finishGetParamsCompany).toHaveBeenCalledWith(data);
      expect(uiState.setPageLoading).toHaveBeenCalled();
      expect(res).toBe(data);
    });

    it('при ошибке вызывает setErrorStatus и failGetParamsCompany, и пробрасывает ошибку', async () => {
      const error = { response: { status: 500, data: { errors: { general: 'Ошибка' } } } };
      (api.get as jest.Mock).mockRejectedValue(error);

      await expect(getParamsCompany({ companyId: 'company-1', dashboardSheetId: 'sheet-1' })).rejects.toBe(error);

      expect(uiState.setErrorStatus).toHaveBeenCalledWith(500);
      expect(companyState.failGetParamsCompany).toHaveBeenCalledWith({ general: 'Ошибка' });
    });
  });

  describe('updateCompany', () => {
    it('обновляет компанию и перезапрашивает параметры', async () => {
      const company = { id: 'company-1', name: 'Новое имя' };
      (api.post as jest.Mock).mockResolvedValue({ data: { id: 'company-1' } });
      (api.get as jest.Mock).mockResolvedValue({ data: { id: 'company-1' } });

      await updateCompany(company);

      expect(companyState.startLoading).toHaveBeenCalled();
      expect(api.post).toHaveBeenCalledWith(API_PATHS.company.update, company);
      expect(companyState.finishUpdateCompany).toHaveBeenCalledWith({ id: 'company-1' });
      // Повторный запрос параметров компании
      expect(api.get).toHaveBeenCalledWith(`${API_PATHS.paramsCompany.get}?companyId=company-1&dashboardSheetId=`);
    });

    it('при ошибке вызывает failUpdateCompany и пробрасывает ошибку', async () => {
      const company = { id: 'company-1', name: 'Новое имя' };
      const error = { response: { status: 400, data: { errors: { name: 'required' } } } };
      (api.post as jest.Mock).mockRejectedValue(error);

      await expect(updateCompany(company)).rejects.toBe(error);

      expect(uiState.setErrorStatus).toHaveBeenCalledWith(400);
      expect(companyState.failUpdateCompany).toHaveBeenCalledWith({ name: 'required' });
    });
  });

  describe('deleteSheet', () => {
    it('удаляет лист и обновляет стор', async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: {} });

      await deleteSheet({ companyId: 'company-1', sheetId: 'sheet-1' });

      expect(companyState.startLoading).toHaveBeenCalled();
      expect(api.post).toHaveBeenCalledWith(API_PATHS.company.deleteSheet, {
        companyId: 'company-1',
        sheetId: 'sheet-1',
      });
      expect(companyState.finishDeleteSheet).toHaveBeenCalledWith('sheet-1');
    });

    it('при ошибке вызывает failDeleteSheet и пробрасывает ошибку', async () => {
      const error = { response: { status: 500, data: { errors: { general: 'Ошибка' } } } };
      (api.post as jest.Mock).mockRejectedValue(error);

      await expect(deleteSheet({ companyId: 'company-1', sheetId: 'sheet-1' })).rejects.toBe(error);

      expect(uiState.setErrorStatus).toHaveBeenCalledWith(500);
      expect(companyState.failDeleteSheet).toHaveBeenCalledWith({ general: 'Ошибка' });
    });
  });
});
