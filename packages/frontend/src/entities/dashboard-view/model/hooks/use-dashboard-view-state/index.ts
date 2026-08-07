import * as s from '../../selectors';
import { useSelector } from 'react-redux';
import { ViewItemId } from '../../../types';



interface Config {
  parentId? : ViewItemId
}

export const useDashboardViewState = (config: Config = {}) => {
  const { parentId } = config;

  const loading                  = useSelector(s.selectLoading);
  const errors                   = useSelector(s.selectErrors);
  const isMounted                = useSelector(s.selectIsMounted);
  const isLoaded                 = useSelector(s.selectIsLoaded);

  const editMode                 = useSelector(s.selectEditMode);
  const entities                 = useSelector(s.selectEntities);
  const viewItems                = useSelector(s.selectViewItems);
  const parentsViewItems         = useSelector(s.selectParentsViewItems);
  const activatedMovementId      = useSelector(s.selectActivatedMovementId);
  const activatedCopied          = useSelector(s.selectActivatedCopied);
  const newSelectedId            = useSelector(s.selectNewSelectedId);
  const selectedId               = useSelector(s.selectSelectedId);
  const bright                   = useSelector(s.selectBright);
  const selectedItem             = useSelector(s.selectSelectedItem);
  const fromGlobalKod            = useSelector(s.selectFromGlobalKod);
  const globalKodParent          = useSelector(s.selectGlobalKodParent);

  const newStoredViewItem        = useSelector(s.selectNewStoredViewItem);
  const prevStoredViewItem       = useSelector(s.selectPrevStoredViewItem);

  const selectChildrenViewItems  = s.makeSelectChildrenViewItems(parentId as ViewItemId);
  const childrenViewItems        = useSelector(selectChildrenViewItems);
  const parentChildrenIds        = childrenViewItems.map(item => item.id);

  // Changes
  const isUnsaved                = useSelector(s.selectIsUnsaved);
  const changedViewItem          = useSelector(s.selectChangedViewItem); // Объект с изменившимися полями


  return {
    loading,
    errors,
    isMounted,
    isLoaded,

    editMode,
    entities,
    viewItems,
    parentsViewItems,
    parentChildrenIds,

    // View
    newSelectedId,
    selectedId,
    selectedItem,
    bright,
    fromGlobalKod,
    globalKodParent,

    newStoredViewItem,
    prevStoredViewItem,
    childrenViewItems,

    // Changes
    isUnsaved,
    changedViewItem,

    // Movement
    activatedMovementId,

    // Copying
    activatedCopied,
  }
};
