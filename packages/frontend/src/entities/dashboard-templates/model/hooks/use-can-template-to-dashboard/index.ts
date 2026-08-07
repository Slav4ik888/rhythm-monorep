import { useMemo } from 'react';
import { useDashboardViewState } from 'entities/dashboard-view';



export const useCanTemplateToDashboard = () => {
  const { entities, selectedItem } = useDashboardViewState();

  const canAddFromTemplate = useMemo(() => {
    // Добавить можно только в Box или как первый элемент на лист
    if (! selectedItem?.id) return true // нет выбранного элемента
    else if (entities[selectedItem?.id]?.type !== 'box') return false;

    return true;
  },
    [entities, selectedItem]
  );


  return {
    canAddFromTemplate
  }
};
