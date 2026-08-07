import { dashboardViewCreateGroupItemsController } from './create-group-items'
import { dashboardViewUpdateController } from './update'
import { dashboardViewDeleteController } from './delete'
import { dashboardViewGetController } from './get'


export default {
  get              : dashboardViewGetController,
  createGroupItems : dashboardViewCreateGroupItemsController,
  update           : dashboardViewUpdateController,
  delete           : dashboardViewDeleteController,
}
