import { ViewItem } from 'entities/dashboard-view';
import { DashboardTemplatesEntities } from '../../slice/state-schema'



/**
 * По id выбранного элемента находит этот элемент среди шаблонов
 * @param entities
 * @param selectedId
 * @returns id шаблона
 */
export const findViewItemById = (
  entities: DashboardTemplatesEntities,
  selectedId: string | undefined
): ViewItem | undefined => {
  if (! selectedId || ! entities) return undefined

  let result: ViewItem | undefined;

  Object.entries(entities).forEach(([key, entity]) => {
    const viewItem = Object.values(entity.viewItems).find(item => item.id === selectedId);

    if (result === undefined && viewItem) {
      result = viewItem;
    }
  })

  return result;
}
