import { updateGroupViewItemsModel } from './update';
import { deleteViewItemModel } from './delete';
import { createGroupViewItemsModel } from './create-group-items';

export default {
  createGroupItems: createGroupViewItemsModel,
  updateGroupItems: updateGroupViewItemsModel,
  delete: deleteViewItemModel,
};

export { createGroupViewItemsModel, CreateGroupViewItems, CreateGroupViewItemsArgs } from './create-group-items';
export { updateGroupViewItemsModel, UpdateViewItem, UpdateViewItemArgs, PartialViewItemUpdate } from './update';
export { deleteViewItemModel, DeleteViews, DeleteViewsArgs } from './delete';
