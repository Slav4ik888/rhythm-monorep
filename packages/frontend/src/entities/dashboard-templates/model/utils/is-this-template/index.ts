import { ViewItemId } from 'entities/dashboard-view';
import { DashboardTemplatesEntities } from '../../slice/state-schema';
import { findTemplateBySelectedId } from '../find-template-by-selected-id';



/**
 * Является новый элемент, элементом из текущего шаблона?
 */
export const isThisTemplate = (
  entities   : DashboardTemplatesEntities,
  selectedId : ViewItemId | undefined, // selectedId from state
  payload    : ViewItemId | undefined  // payload from action
): boolean => {
  const currentTemplateId = findTemplateBySelectedId(entities, selectedId)?.id;
  const newTemplateId = findTemplateBySelectedId(entities, payload)?.id;

  return currentTemplateId === newTemplateId;
}
