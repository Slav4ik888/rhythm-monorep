// packages/frontend/src/features/hints/model/hooks/use-features-hints/index.ts

import { useHints } from 'entities/hints';
import { useMemo } from 'react';
import { userApi } from 'shared/api/features/user';
import { api } from 'shared/api';
import { useHintsStore } from 'entities/hints/model/store';
import { LS } from 'shared/lib/local-storage';
import type { ReqDontShowAgain } from 'shared/api/features/hints';

export const useFeatureHints = () => {
  const actions = useHints();

  const api2 = useMemo(
    () => ({
      serviceDontShowAgain: async (data: ReqDontShowAgain) => {
        const hintsStore = useHintsStore.getState();

        hintsStore.startLoading();

        try {
          if (data.id && data.companyId) {
            // Иначе сохранится только в LS (как и было в оригинальном asyncThunk)
            await userApi.update(api, data as any);
          }

          // Сохраняем currentHintId до вызова finishDontShowAgain,
          // т.к. finishDontShowAgain может изменить currentHintId
          const lastCurrentHintId = hintsStore.currentHintId;

          if (lastCurrentHintId) {
            LS.setHintsDontShowAgain(lastCurrentHintId);
          }

          hintsStore.finishDontShowAgain(lastCurrentHintId || '');
        } catch (e) {
          const errorData = (e as { response?: { data?: Record<string, string> } }).response?.data || {
            general: 'Error in features/hints/dontShowAgain',
          };
          hintsStore.failDontShowAgain(errorData);
        }
      },
    }),
    [],
  );

  return {
    ...actions,
    ...api2,
  };
};
