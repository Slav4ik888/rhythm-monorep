// packages/frontend/src/shared/api/hooks/use-auth-query.test.ts

import { renderHook, waitFor } from '@testing-library/react';
import { useAuthQuery } from './use-auth-query';
import { createWrapper } from './tests/test-utils';
import { getAuth, useUserStore } from 'entities/user';

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

jest.mock('entities/user', () => {
  const store = { _isLoaded: false, loading: false };

  const useUserStoreMock = (selector?: (s: any) => any) => (selector ? selector(store) : store);
  (useUserStoreMock as any).getState = () => store;
  (useUserStoreMock as any).setState = (partial: any) => Object.assign(store, partial);

  return {
    getAuth: jest.fn(),
    useUserStore: useUserStoreMock,
  };
});

describe('useAuthQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUserStore.setState as any)({ _isLoaded: false, loading: false });
  });

  it('вызывает getAuth при монтировании и завершает загрузку', async () => {
    const { result } = renderHook(() => useAuthQuery(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getAuth).toHaveBeenCalledTimes(1);
    expect(getAuth).toHaveBeenCalledWith(
      { pathname: expect.any(String) },
      expect.objectContaining({ get: expect.any(Function) }),
    );
    expect(result.current.authError).toBeNull();
  });

  it('isAuthLoaded отражает состояние стора пользователя', () => {
    (useUserStore.setState as any)({ _isLoaded: true, loading: false });

    const { result } = renderHook(() => useAuthQuery(), { wrapper: createWrapper() });

    expect(result.current.isAuthLoaded).toBe(true);
  });

  it('isLoading = true, если стор пользователя в состоянии loading', async () => {
    (useUserStore.setState as any)({ _isLoaded: false, loading: true });

    const { result } = renderHook(() => useAuthQuery(), { wrapper: createWrapper() });

    // loading из стора форсит isLoading, даже пока query ещё в pending
    expect(result.current.isLoading).toBe(true);
  });
});
