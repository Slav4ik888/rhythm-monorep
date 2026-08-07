import { ViewItem } from 'entities/dashboard-view';
import { DashboardTemplatesEntities } from '../../slice/state-schema'
import { findTemplateBySelectedId } from '../find-template-by-selected-id';


/**
 * Находит корневой элемент текущего шаблона, по id выбранного элемента
 * @param entities
 * @param selectedId
 * @returns Template
 */
export const findMainViewItemById = (
  entities   : DashboardTemplatesEntities,
  selectedId : string | undefined
): ViewItem | undefined => {
  if (! selectedId || ! entities) return undefined

  const template = findTemplateBySelectedId(entities, selectedId);

  if (! template) return undefined

  return Object.values(template.viewItems).find(item => item.parentId === template.id);
}
