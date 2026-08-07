import {
  DashboardDataEntities, DashboardDataDates, DashboardItemData, DashboardStatisticItem
 } from 'entities/dashboard-data';
import { StatisticPeriodType } from 'entities/statistic-type';
import { GoogleSheetData, ResGetData, StartEntitiesData } from 'shared/types/dashboard-data';



/** Вернуть индексы якорей */
function getIdxAnchors(allSheetData: DashboardItemData<string | number>[]) {
  const getIdxByKod = (label: string): number => allSheetData?.[0].findIndex(value => value === label);

  return {
    kodIdx         : getIdxByKod('#kod'),
    periodTypeIdx  : getIdxByKod('#periodType'),
    companyTypeIdx : getIdxByKod('#companyType'),
    productTypeIdx : getIdxByKod('#productType'),
    titleIdx       : getIdxByKod('#title')
  }
}


interface ObjGSData {
  [key: string]: DashboardItemData<string | number>;
}


// Transform Google Sheets data into object where { col_1: array, col_2: array }  column data
function transformToObject(data: GoogleSheetData): ObjGSData {
  const obj: ObjGSData = {};

  for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
    for (let colIdx = 0; colIdx < data[rowIdx]?.length; colIdx++) {
      if (!obj[`col_${colIdx}`]) {
        obj[`col_${colIdx}`] = [];
      }

      obj[`col_${colIdx}`].push(data[rowIdx][colIdx]);
    }
  }

  return obj
}



function transformToArray(obj: ObjGSData): DashboardItemData<string | number>[] {
  return obj ? Object.values(obj) : [];
  // const res: DashboardItemData<string | number>[] = [];
  // for (const key in obj) {
  //   if (Object.prototype.hasOwnProperty.call(obj, key)) {
  //     res.push(obj[key]);
  //   }
  // }
  // return res
}


/**
 * Transform Google Sheets row data into column data
 * @param data Google Sheets data
 */
export const transformGSData = (data: GoogleSheetData): DashboardItemData<string | number>[] => {
  const obj = transformToObject(data);
  const res = transformToArray(obj);

  return res;
}


/** Returns startEntities & startDates  */
export const getEntities = (data: ResGetData): StartEntitiesData => {
  const startEntities: DashboardDataEntities = {};
  const startDates: DashboardDataDates = {};

  // Обрабатываем каждую вкладку
  /* eslint-disable-next-line */
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      // Трансформируем в столбцы
      const allSheetData = transformGSData(data?.[key]);

      // Определяем индексы констант по 1й колонке
      const { kodIdx, periodTypeIdx, companyTypeIdx, productTypeIdx, titleIdx } = getIdxAnchors(allSheetData);
      const sheetStatisticType = allSheetData?.[1]?.[0] as string; // В ячейке B1 находится #sheet_type - тип статистики вкладки: мес | нед | мес (кален)
      const dataRow = allSheetData?.[1]?.[1] as number; // В ячейке B2 находится № строки с которой начинаются данные


      // Добавляем в entities
      allSheetData.forEach((columnData: DashboardItemData<string | number>, idx) => {
        const kod = columnData?.[kodIdx] as string;
        const currentPeriodType = columnData?.[periodTypeIdx] as StatisticPeriodType;
        const validPeriodType = currentPeriodType === sheetStatisticType;

        // Проверить есть ли код, соответствует ли statisticType данной вкладке и idx !== 0 (это колонка с датой)
        if (kod && idx && validPeriodType) {
          startEntities[kod]             = {} as DashboardStatisticItem;
          startEntities[kod].kod         = kod;
          startEntities[kod].periodType  = currentPeriodType;
          startEntities[kod].companyType = columnData?.[companyTypeIdx] as string;
          startEntities[kod].productType = columnData?.[productTypeIdx] as string;
          startEntities[kod].title       = columnData?.[titleIdx] as string;
          startEntities[kod].data        = columnData?.slice(dataRow - 1);
        }
      });

      // Добавляем в dates
      startDates[sheetStatisticType] = allSheetData?.[0]
        .slice(dataRow - 1)
        .map((date: string | number) => new Date(date).getTime());
    }
  }

  return {
    startEntities,
    startDates
  }
}
