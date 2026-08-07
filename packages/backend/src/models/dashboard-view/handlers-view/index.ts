import { updateGroupViewItemsModel } from './update'
import { deleteViewItemModel } from './delete'
import { createGroupViewItemsModel } from './create-group-items'

export default {
  createGroupItems : createGroupViewItemsModel,
  updateGroupItems : updateGroupViewItemsModel,
  delete           : deleteViewItemModel,
}
