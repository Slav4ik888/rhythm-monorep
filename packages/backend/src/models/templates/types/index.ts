import { ItemBase } from '../../base';
import { ViewItem, ViewItemId, ViewItemType } from '../../dashboard-view/types';



/**
 * v.2025-06-29
 * Template
 */
export interface Template extends ItemBase {
  id        : ViewItemId // Начальный ViewItem от которого строиться всё дерево === id (templateId)
  type      : ViewItemType
  bunchId   : ViewItemId

  viewItems : Record<ViewItemId, ViewItem>
}

export type PartialTemplate = Partial<Template> & { id: ViewItemId }
