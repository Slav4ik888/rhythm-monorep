import { updateEntities } from 'entities/base';
import { LS } from 'shared/lib/local-storage';
import { getViewitemsFromBunches } from '../get-viewitems-from-bunches';
import { StateSchemaDashboardView } from '../../slice/state-schema';



/** Returns initialState из данных сохранённых в LS by companyId */
export const getInitialState = (companyId: string): StateSchemaDashboardView => {
  const initialState: StateSchemaDashboardView = {
    loading               : false,
    errors                : {},
    _isMounted            : true,
    _isLoaded             : false, // Загружены ViewItems

    editMode              : LS.getEditMode(companyId) || false,
    newSelectedId         : '',
    selectedId            : '',
    bright                : false,
    isUnsaved             : false, // Наличие не сохраненных изменений (в тч customSettings in Company)

    entities              : updateEntities({}, getViewitemsFromBunches(LS.getBunches(companyId)) || []),

    newStoredViewItem     : undefined, // Начальные значения выбранного элемента
    prevStoredViewItem    : undefined, // Начальные значения предыдущего выбранного элемента

    activatedMovementId   : '', // Активированный Id перемещаемого элемента
    activatedCopied       : undefined, // Активированный Id копируемого элемента
  };

  return initialState;
}
