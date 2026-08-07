// import { ViewItem, ViewItemId } from '../../types';


// /**
//  * DEPRECATED
//  * Преобразовывает к новому виду структуру rootItem with children
//  */
// export function organizeViewItemsIntoEntities(items: ViewItem[]): Record<ViewItemId, ViewItem> {
//   const allItems = new Map<ViewItemId, ViewItem>();
//   const rootItems: ViewItem[] = [];

//   // 1. Инициализация
//   items.forEach(item => {
//     const newItem = { ...item, children: {} };
//     allItems.set(item.id, newItem);

//     if (item.parentId === 'no_parentId') {
//       rootItems.push(newItem);
//     }
//   });

//   // 2. Сбор всех потомков в корневой children
//   rootItems.forEach(rootItem => {
//     function collectChildren(parentId: ViewItemId) {
//       items.filter(item => item.parentId === parentId).forEach(item => {
//         rootItem.children![item.id] = allItems.get(item.id)!;
//         collectChildren(item.id); // Рекурсивно собираем детей
//       });
//     }

//     collectChildren(rootItem.id);
//   });

//   // 3. Сортировка корней
//   rootItems.sort((a, b) => a.order - b.order);

//   // 4. Формирование результата
//   const result: Record<ViewItemId, ViewItem> = {};
//   rootItems.forEach(item => {
//     result[item.id] = item;
//   });

//   // console.log('result: ', result);
//   // Object.values(result).forEach(item => {
//   //   console.log('rootItem.children.length: ', item.children?.length);
//   //   // Calc max depth
//   //   const maxTreeLength = devCalcMaxTreeLength(item, items);
//   //   console.log('maxTreeLength: ', maxTreeLength);
//   // });

//   return result;
// }
