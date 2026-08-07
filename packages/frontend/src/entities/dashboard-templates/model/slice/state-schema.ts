import { ViewItemId } from 'entities/dashboard-view';
import { BunchesUpdated } from 'shared/lib/structures/bunch';
import { Errors } from 'shared/lib/validators';
import { Template } from '../types';



export interface DashboardTemplatesEntities {
  [viewItemId: ViewItemId]: Template
}


// STATE
export interface StateSchemaDashboardTemplates {
  loading        : boolean
  errors         : Errors
  _isMounted     : boolean    // Признак того, что Reducer mounted

  bunchesUpdated : BunchesUpdated | undefined // Данные с БД

  entities       : DashboardTemplatesEntities
  opened         : boolean    // Открыто ли окошко с шаблонами

  selectedId     : ViewItemId | undefined // Id выбранного элемента (при editMode === true)
  storedSelected : Template | undefined
}
