export {
  Template, PartialTemplate
} from './model/types'
export { actions as actionsDashboardTemplates, reducer as reducerDashboardTemplates } from './model/slice'
export {
  DashboardTemplatesEntities, StateSchemaDashboardTemplates
} from './model/slice/state-schema'
export { useDashboardTemplates, useCanTemplateToDashboard } from './model/hooks'
export { getInitialState, isThisTemplate } from './model/utils'
export { MAX_COUNT_BUNCH_TEMPLATES, TEMPLATES_MOCK_DATA } from './model/consts'
