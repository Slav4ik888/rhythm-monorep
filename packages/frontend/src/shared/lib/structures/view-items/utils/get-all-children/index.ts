import { ViewItemId } from 'entities/dashboard-view';



function selectAllChildren<T extends { id: ViewItemId, parentId: ViewItemId }>(
  items       : T[],
  currentId   : ViewItemId | undefined,
  resultArray : T[]
): void {
  // Находим текущий элемент (чтобы получить его bunchId)
  const currentItem = items.find(item => item.id === currentId);

  if (! currentItem) return; // если элемент не найден, прекращаем рекурсию

  // Добавляем текущий элемент в результат
  resultArray.push(currentItem);

  // Находим всех детей текущего элемента
  const children = items.filter(item => item.parentId === currentId);

  // Рекурсивно обрабатываем каждого ребёнка
  children.forEach(child => {
    selectAllChildren(items, child.id, resultArray);
  });
}

/**
 * Собирает все вложенные children (включая текущий элемент) в виде { id, bunchId }
 */
export function getAllChildren<T extends { id: ViewItemId, parentId: ViewItemId }>(
  items     : T[],
  currentId : ViewItemId | undefined,
): T[] {
  const resultArray : T[] = []

  selectAllChildren(items, currentId, resultArray)

  return resultArray;
}
