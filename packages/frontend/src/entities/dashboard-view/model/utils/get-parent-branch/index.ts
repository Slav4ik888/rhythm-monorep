import { DashboardViewEntities } from '../../slice/state-schema';
import { ViewItemId } from '../../../types';


/** Возвращает ветку всех существующих родителей */
export function getParentBranch(entities: DashboardViewEntities, targetId: ViewItemId | undefined) {
  const branch = [];
  let currentId = targetId;
  const visitedIds = new Set<ViewItemId>(); // Для отслеживания посещённых узлов

  // Идем вверх по parentId, пока не достигнем корня (parentId === null)
  while (currentId && entities[currentId]) {
    if (visitedIds.has(currentId)) { // Обнаружен цикл, прерываем выполнение
      // console.warn(`Обнаружена циклическая зависимость: ${currentId} уже был посещён.`);
      break;
    }
    visitedIds.add(currentId);

    const currentItem = entities[currentId];
    if (currentItem?.parentId) {
      if (entities[currentItem.parentId]) { // Проверяем существует ли такой parentId
        branch.push(currentItem.parentId);
      }
    }
    currentId = currentItem?.parentId;
  }

  return branch;
}
