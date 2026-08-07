// import { updateEntities } from 'entities/base';
// import { ViewItem, ViewItemId } from '../../../types';


// /**
//  * Вычисляет длину дерева детей (вперёд)
//  */
// export const calcLengthOfTree = (item: ViewItem | undefined, items: ViewItem[]) => {
//   let depth = 0;

//   if (! item) return 0;

//   const child = items.find(child => child.parentId === item.id);
//   if (child) {
//     depth += calcLengthOfTree(child, items);
//   }

//   return depth + 1; // Корневой это 1
// };

// /** Рассчитывает макс длину ветки rootItem */
// export const devCalcMaxTreeLength = (rootItem: ViewItem, items: ViewItem[]): number => {
//   let maxLength = 0;

//   // Преобразуем в объект Record<ViewItemId, ViewItem>
//   const entities: Record<ViewItemId, ViewItem> = updateEntities({}, items);

//   if (rootItem.children) {
//     Object.values(rootItem.children)?.forEach((child) => {
//       // Для каждого child выстраиваем путь
//       const childLength = calcLengthOfTree(entities[child.id], items);
//       maxLength = Math.max(maxLength, childLength);
//     });
//   }

//   return maxLength + 1; // Корневой это 1
// };
