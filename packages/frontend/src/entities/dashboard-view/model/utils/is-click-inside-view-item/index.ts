import { DashboardViewEntities } from '../../slice/state-schema';
import { getParentBranch } from '../get-parent-branch';



/**
 * Проверяет, нажали внутрь элемента (на его потомка) или нет.
 *
 * Например, перемещаем элемент и нажали на тот в который хотим переместить.
 * Надо понять, нажали внутрь элемента (на его потомка) или нет?
 * Если на потомка, ф-я возвращает true и у потомка, в который перемещаем,
 * нужно будет поменять parentId на parentId перемещаемого элемента.
 */
export const isClickInsideViewItem = (
  entities            : DashboardViewEntities,
  activatedMovementId : string, // Id элемента который хотим переместить
  id                  : string  // Id куда хотим поместить
) => Boolean(getParentBranch(entities, id).find(parentId => parentId === activatedMovementId));
