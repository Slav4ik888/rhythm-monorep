import { DashboardViewEntities } from '../../slice/state-schema';
import { ViewItem } from '../../../types';
import { getFirstItemInBranchWithGlobalKod } from '../get-first-item-in-branch-with-global-kod';
import { ViewItemChart } from 'entities/charts';



/**
 * Возвращает Kod от isGlobalKod или код самого элемента (item.settings.kod || chart?.kod)
 *  - для всех типов item.type
 */
export const getKod = (
  entities : DashboardViewEntities,
  item     : ViewItem | undefined,
  chart?   : ViewItemChart // В некоторых ситуациях передаётся сам chart, чтобы вернуть его Код если не подпадёт под другие условия
) => {
  if (! item) return '';

  const globalItem = getFirstItemInBranchWithGlobalKod(entities, item.id);
  const isGlobalKod = globalItem?.settings?.isGlobalKod;
  const globalKod = globalItem?.settings?.kod;


  // If it is NOT CHART
  if (item.type !== 'chart') {
    if (item?.settings?.fromGlobalKod) {
      // Если Kod должен браться fromGlobalKod, то проверяем есть ли он in parentGlobalItem
      if (isGlobalKod && globalKod) return globalKod
    }
    // Возвращаем Kod текущего item
    return item?.settings?.kod || '';
  }

  // If it is CHART
  if (chart) { // Если передали
    if (chart?.fromGlobalKod) {
      // Если Kod должен браться fromGlobalKod, то проверяем есть ли он in parentGlobalItem
      if (isGlobalKod && globalKod) return globalKod
    }
    return chart.kod || '';
  }

  if (item?.settings?.charts?.some(it => it.fromGlobalKod)) { // У одного из charts - fromGlobalKod
    // Если Kod должен браться fromGlobalKod, то проверяем есть ли он in parentGlobalItem
    if (isGlobalKod && globalKod) return globalKod
  }
  // Если не передали chart то возвращаем Kod из первого графика
  return item?.settings?.charts?.[0]?.kod || '';
}
