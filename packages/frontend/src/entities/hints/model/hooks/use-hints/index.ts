import { useMemo } from 'react';
import * as s from '../../selectors';
import { actions } from '../../slice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/lib/hooks';



export const useHints = () => {
  const dispatch = useAppDispatch();

  const hintsQueue    = useSelector(s.selectHintsQueue);
  const shownHints    = useSelector(s.selectShownHints);
  const currentHintId = useSelector(s.selectСurrentHintId);


  const api = useMemo(() => ({
    shownNextHint    : () => dispatch(actions.shownNextHint()),
    closeCurrentHint : () => dispatch(actions.closeCurrentHint()),
    addHintsToQueue  : (hintIds: string[]) => dispatch(actions.addHintsToQueue(hintIds)),
  }),
    [dispatch]
  );


  return {
    hintsQueue,
    shownHints,
    currentHintId,

    ...api
  }
};
