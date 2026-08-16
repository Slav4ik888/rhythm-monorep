// packages/frontend/src/features/hints/model/hooks/use-features-hints/use-features-hints.test.ts
// Unit-тест хука useFeatureHints: serviceDontShowAgain.

import { renderHook, act } from '@testing-library/react';
import { useFeatureHints } from './index';
import { userApi } from 'shared/api/features/user';
import { LS } from 'shared/lib/local-storage';
import { useHintsStore } from 'entities/hints/model/store';
import type { ReqDontShowAgain } from 'shared/api/features/hints';

jest.mock('entities/hints', () => ({
  useHints: () => ({ shownNextHint: jest.fn(), closeCurrentHint: jest.fn(), addHintsToQueue: jest.fn() }),
}));
jest.mock('shared/api/features/user', () => ({
  userApi: { update: jest.fn() },
}));
jest.mock('shared/api', () => ({ api: {} }));
jest.mock('shared/lib/local-storage', () => ({
  LS: { setHintsDontShowAgain: jest.fn() },
}));

describe('useFeatureHints.serviceDontShowAgain', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHintsStore.setState({ currentHintId: 'hint-1', hintsQueue: [], shownHints: [] });
  });

  it('обновляет пользователя, сохраняет в LS и завершает подсказку', async () => {
    (userApi.update as jest.Mock).mockResolvedValue(undefined);
    const { result } = renderHook(() => useFeatureHints());

    await act(async () => {
      await result.current.serviceDontShowAgain({ hintId: 'hint-1', id: 'hint-1', companyId: 'c1' });
    });

    expect(userApi.update).toHaveBeenCalledTimes(1);
    expect(LS.setHintsDontShowAgain).toHaveBeenCalledWith('hint-1');
    expect(useHintsStore.getState().shownHints).toContain('hint-1');
    expect(useHintsStore.getState().loading).toBe(false);
  });

  it('сохраняет в LS и завершает подсказку без запроса к API', async () => {
    const { result } = renderHook(() => useFeatureHints());

    await act(async () => {
      await result.current.serviceDontShowAgain({ hintId: 'hint-1' } as ReqDontShowAgain);
    });

    expect(userApi.update).not.toHaveBeenCalled();
    expect(LS.setHintsDontShowAgain).toHaveBeenCalledWith('hint-1');
    expect(useHintsStore.getState().shownHints).toContain('hint-1');
  });

  it('при ошибке API вызывает failDontShowAgain с ошибкой', async () => {
    (userApi.update as jest.Mock).mockRejectedValue({
      response: { data: { general: 'Ошибка сохранения' } },
    });
    const { result } = renderHook(() => useFeatureHints());

    await act(async () => {
      await result.current.serviceDontShowAgain({ hintId: 'hint-1', id: 'hint-1', companyId: 'c1' });
    });

    expect(useHintsStore.getState().errors).toEqual({ general: 'Ошибка сохранения' });
    expect(useHintsStore.getState().shownHints).not.toContain('hint-1');
  });
});
