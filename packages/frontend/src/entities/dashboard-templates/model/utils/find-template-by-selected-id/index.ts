import { DashboardTemplatesEntities } from '../../slice/state-schema'
import { Template } from '../../types';



/**
 * По id выбранного элемента находит шаблона в котором он находится
 * @param entities
 * @param selectedId
 * @returns Template
 */
export const findTemplateBySelectedId = (
  entities   : DashboardTemplatesEntities,
  selectedId : string | undefined
): Template | undefined => {
  if (! selectedId || ! entities) return undefined

  let templateId = '';

  Object.entries(entities).forEach(([key, entity]) => {
    const viewItem = Object.values(entity.viewItems).find(item => item.id === selectedId);

    if (viewItem) {
      templateId = key;
    }
  })

  return entities[templateId];
}
