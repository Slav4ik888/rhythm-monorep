// packages/frontend/src/entities/hints/model/hooks/use-hints/index.ts

import { useMemo } from 'react';
import { useHintsStore } from '../../store';

export const useHints = () => {
  const hintsQueue = useHintsStore((state) => state.hintsQueue);
  const shownHints = useHintsStore((state) => state.shownHints);
  const currentHintId = useHintsStore((state) => state.currentHintId);

  const api = useMemo(
    () => ({
      shownNextHint: () => useHintsStore.getState().shownNextHint(),
      closeCurrentHint: () => useHintsStore.getState().closeCurrentHint(),
      addHintsToQueue: (hintIds: string[]) => useHintsStore.getState().addHintsToQueue(hintIds),
    }),
    [],
  );

  return {
    hintsQueue,
    shownHints,
    currentHintId,

    ...api,
  };
};
