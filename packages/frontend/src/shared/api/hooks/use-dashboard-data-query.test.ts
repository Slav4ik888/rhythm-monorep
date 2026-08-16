// packages/frontend/src/shared/api/hooks/use-dashboard-data-query.test.ts

import { renderHook, waitFor } from '@testing-library/react';
import { useGetDashboardDataQuery } from './use-dashboard-data-query';
import { createWrapper } from './tests/test-utils';
import { api } from 'shared/api';
import { useDashboardDataStore } from 'entities/dashboard-data';
import { useUIStore } from 'entities/ui';
import { getEntities } from 'features/dashboard-data/get-data/model/services/get-data/utils';

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

jest.mock('entities/dashboard-data', () => {
  const store = {
    startLoading: jest.fn(),
    finishGetData: jest.fn(),
    failGetData: jest.fn(),
  };

  return { useDashboardDataStore: { getState: () => store } };
});

jest.mock('entities/ui', () => {
  const store = {
    setPageLoading: jest.fn(),
    setSuccessMessage: jest.fn(),
    setWarningMessage: jest.fn(),
  };

  return { useUIStore: { getState: () => store } };
});

jest.mock('shared/lib/local-storage', () => ({
  LS: { devSetGSData: jest.fn() },
}));

jest.mock('shared/lib/tests/__dev-log', () => ({
  __devLog: jest.fn(),
}));

jest.mock('features/dashboard-data/get-data/model/services/get-data/utils', () => ({
  getEntities: jest.fn(() => ({ startEntities: { a: 1 }, startDates: { b: 2 } })),
}));

const dataState = useDashboardDataStore.getState() as unknown as Record<string, jest.Mock>;
const uiState = useUIStore.getState() as unknown as Record<string, jest.Mock>;

describe('useGetDashboardDataQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('загружает данные из Google Sheets и обновляет стор', async () => {
    const raw = { sheet1: [['1', '2']] };
    (api.post as jest.Mock).mockResolvedValue({ data: raw });

    const { result } = renderHook(() => useGetDashboardDataQuery({ companyId: 'c1', dashboardSheetId: 's1' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.post).toHaveBeenCalledWith('/getData', { companyId: 'c1', dashboardSheetId: 's1' }, expect.any(Object));
    expect(dataState.startLoading).toHaveBeenCalled();
    expect(getEntities).toHaveBeenCalledWith(raw);
    expect(dataState.finishGetData).toHaveBeenCalledWith({
      companyId: 'c1',
      startEntities: { a: 1 },
      startDates: { b: 2 },
    });
    expect(uiState.setSuccessMessage).toHaveBeenCalled();
    expect(result.current.data).toEqual({ companyId: 'c1', data: { startEntities: { a: 1 }, startDates: { b: 2 } } });
  });

  it('при ошибке снимает спиннер, сообщает об ошибке и пробрасывает её', async () => {
    const error = { response: { data: { general: 'Ошибка загрузки' } } };
    (api.post as jest.Mock).mockRejectedValue(error);

    renderHook(() => useGetDashboardDataQuery({ companyId: 'c1', dashboardSheetId: 's1' }), {
      wrapper: createWrapper(),
    });

    // queryFn выбрасывает ошибку уже на первой попытке (до retry), поэтому failGetData срабатывает сразу
    await waitFor(() => expect(dataState.failGetData).toHaveBeenCalled());

    expect(dataState.failGetData).toHaveBeenCalledWith({ general: 'Ошибка загрузки' });
    expect(uiState.setWarningMessage).toHaveBeenCalledWith('Ошибка загрузки');
    expect(uiState.setPageLoading).toHaveBeenCalled();
  });

  it('не делает запрос, если companyId или dashboardSheetId пустые', () => {
    renderHook(() => useGetDashboardDataQuery({ companyId: 'c1', dashboardSheetId: '' }), {
      wrapper: createWrapper(),
    });

    expect(api.post).not.toHaveBeenCalled();
  });
});
