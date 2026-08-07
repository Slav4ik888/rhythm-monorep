import { templatesGetTemplatesController as getTemplates } from './get-templates'
import { templatesUpdateController as update } from './update'
import { templatesGetBunchesUpdatedController as getBunchesUpdated } from './get-bunches-updated'
import { templatesDeleteController as deleteTemplate } from './delete'

export default {
  getBunchesUpdated,
  getTemplates,
  update,
  deleteTemplate
}
