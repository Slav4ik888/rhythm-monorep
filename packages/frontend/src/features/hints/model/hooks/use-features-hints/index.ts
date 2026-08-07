import { useHints } from 'entities/hints';
import { dontShowAgain, ReqDontShowAgain } from 'shared/api/features/hints';
import { useMemo } from 'react';
import { useAppDispatch } from 'shared/lib/hooks';



export const useFeatureHints = () => {
  const dispatch = useAppDispatch();
  const actions = useHints();

  const api = useMemo(() => ({
    serviceDontShowAgain: (data: ReqDontShowAgain) => dispatch(dontShowAgain(data)),
  }),
    [dispatch]
  );


  return {
    ...actions,
    ...api
  }
};
