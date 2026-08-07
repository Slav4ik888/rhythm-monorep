import { Errors } from 'shared/lib/validators';
import { ViewItem, ViewItemId } from '../../types';


export type ActivatedCopiedType = 'copyItemFirstOnly' | 'copyItemsAll' | 'copyStyles';
export interface ActivatedCopied {
  type : ActivatedCopiedType
  id   : ViewItemId // id копируемого элемента
}

export interface DashboardViewEntities {
  [viewItemId: ViewItemId]: ViewItem
}


// STATE
export interface StateSchemaDashboardView {
  loading             : boolean
  errors              : Errors
  _isMounted          : boolean // Признак того, что Reducer mounted
  _isLoaded           : boolean // Загружены ViewItems

  editMode            : boolean // Режим редактирования
  entities            : DashboardViewEntities

  // Id выбранного элемента (на время пока loading === true),
  // чтобы если при сохранении будет ошибка, то можно было это уладить до переключения на следующий элемент
  // После loading === false, должно произойти selectedId = newSelectedId
  newSelectedId       : ViewItemId
  selectedId          : ViewItemId // Id выбранного элемента (при editMode === true)
  bright              : boolean    // Подсветка выбранного элемента (selectedId)

  isUnsaved           : boolean // Наличие не сохраненных изменений (в тч customSettings in Company)
  // Начальные значения выбранного элемента, чтобы затем перевести его в статус prevStoredView
  // само по себе используется только в UnsavedChanges, а также для промежуточного хранения
  newStoredViewItem   : ViewItem | undefined
  // Начальные значения предыдущего выбранного элемента, которое можно сравнивать для сохранения изменений
  // Используется при смене selectedId
  // Также в случае ошибки, сюда сохраняется newStoredViewItem
  prevStoredViewItem  : ViewItem | undefined

  // Активированный Id перемещаемого элемента
  activatedMovementId : ViewItemId

  // Активированный Id копируемого элемента
  activatedCopied     : ActivatedCopied | undefined
}
