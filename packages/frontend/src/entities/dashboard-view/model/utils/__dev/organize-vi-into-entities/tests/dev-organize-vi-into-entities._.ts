// import { ViewItem } from '../../../types';
// import { organizeViewItemsIntoEntities } from '..';



// describe('organizeViewItemsIntoEntities', () => {
//   it('should return empty object for empty input', () => {
//     const result = organizeViewItemsIntoEntities([]);
//     expect(result).toEqual({});
//   });

//   it('should handle single root item', () => {
//     const items: ViewItem[] = [
//       {
//         id: '1',
//         order: 1,
//         parentId: 'no_parentId',
//         sheetId: 'sheet1',
//         type: 'box',
//         styles: {},
//       },
//     ] as ViewItem[];

//     const result = organizeViewItemsIntoEntities(items);
//     expect(result).toEqual({
//       '1': {
//         id: '1',
//         order: 1,
//         parentId: 'no_parentId',
//         sheetId: 'sheet1',
//         type: 'box',
//         styles: {},
//         children: {},
//       },
//     });
//   });

//   it('should nest children under correct parent', () => {
//     const items: ViewItem[] = [
//       {
//         id: '1',
//         order: 1,
//         parentId: 'no_parentId',
//         sheetId: 'sheet1',
//         type: 'box',
//         styles: {},
//       },
//       {
//         id: '2',
//         order: 1,
//         parentId: '1',
//         sheetId: 'sheet1',
//         type: 'text',
//         styles: {},
//       },
//     ] as ViewItem[];

//     const result = organizeViewItemsIntoEntities(items);
//     expect(result['1'].children).toHaveProperty('2');
//     expect(result['1'].children?.['2']?.parentId).toBe('1');
//   });


//   it('should correctly sort root items by order', () => {
//     const items: ViewItem[] = [
//       {
//         id: 'root2',
//         order: 2,
//         parentId: 'no_parentId',
//         sheetId: 'sheet1',
//         type: 'container',
//         styles: {},
//       },
//       {
//         id: 'root1',
//         order: 1,
//         parentId: 'no_parentId',
//         sheetId: 'sheet1',
//         type: 'container',
//         styles: {},
//       },
//       {
//         id: 'child1',
//         order: 1,
//         parentId: 'root1',
//         sheetId: 'sheet1',
//         type: 'text',
//         styles: {},
//       },
//       {
//         id: 'child2',
//         order: 2,
//         parentId: 'root1',
//         sheetId: 'sheet1',
//         type: 'text',
//         styles: {},
//       },
//     ] as ViewItem[];

//     const result = organizeViewItemsIntoEntities(items);

//     // Проверяем порядок корневых элементов
//     const rootIds = Object.keys(result);
//     expect(rootIds).toEqual(['root1', 'root2']); // Должно быть по order: 1, 2

//     // Проверяем что дети не сортируются
//     // eslint-disable-next-line dot-notation
//     const childrenIds = Object.keys(result['root1'].children!);
//     expect(childrenIds).toEqual(['child1', 'child2']); // Оригинальный порядок
//   });

//   it('глубокая вложенность', () => {
//     const items: ViewItem[] = [
//       {
//         id: 'root1',
//         order: 1,
//         parentId: 'no_parentId',
//       },
//       {
//         id: 'root2',
//         order: 1,
//         parentId: 'no_parentId',
//       },
//       {
//         id: 'child1',
//         order: 3,
//         parentId: 'root1',
//       },
//       {
//         id: 'child11',
//         order: 3,
//         parentId: 'child1',
//       },
//       {
//         id: 'child111',
//         order: 3,
//         parentId: 'child11',
//       },
//       {
//         id: 'child2',
//         order: 1,
//         parentId: 'root2',
//       },
//       {
//         id: 'child22',
//         order: 1,
//         parentId: 'child2',
//       },
//       {
//         id: 'child23',
//         order: 1,
//         parentId: 'child2',
//       },
//       {
//         id: 'child222',
//         order: 1,
//         parentId: 'child22',
//       },
//     ] as ViewItem[];

//     const result = organizeViewItemsIntoEntities(items);
//     expect(Object.keys(result).length).toBe(2);
//     expect(Object.keys(result.root1.children!).length).toBe(3);
//     expect(Object.keys(result.root2.children!).length).toBe(4);
//   });

//   it('should maintain original children order', () => {
//     const items: ViewItem[] = [
//       {
//         id: 'root',
//         order: 1,
//         parentId: 'no_parentId',
//         sheetId: 'sheet1',
//         type: 'container',
//         styles: {},
//       },
//       {
//         id: 'child3',
//         order: 3,
//         parentId: 'root',
//         sheetId: 'sheet1',
//         type: 'text',
//         styles: {},
//       },
//       {
//         id: 'child1',
//         order: 1,
//         parentId: 'root',
//         sheetId: 'sheet1',
//         type: 'text',
//         styles: {},
//       },
//     ] as ViewItem[];

//     const result = organizeViewItemsIntoEntities(items);
//     // eslint-disable-next-line dot-notation
//     const childrenIds = Object.keys(result['root'].children!);
//     expect(childrenIds).toEqual(['child3', 'child1']); // Оригинальный порядок
//   });


//   it('should ignore items with invalid parentId', () => {
//     const items: ViewItem[] = [
//       {
//         id: '1',
//         order: 1,
//         parentId: 'no_parentId',
//         sheetId: 'sheet1',
//         type: 'box',
//         styles: {},
//       },
//       {
//         id: '2',
//         order: 1,
//         parentId: 'nonexistent',
//         sheetId: 'sheet1',
//         type: 'text',
//         styles: {},
//       },
//     ] as ViewItem[];

//     const result = organizeViewItemsIntoEntities(items);
//     expect(result['1'].children).toEqual({});
//     expect(Object.keys(result).length).toBe(1);
//   });

//   it('should maintain empty children for items without children', () => {
//     const items: ViewItem[] = [
//       {
//         id: '1',
//         order: 1,
//         parentId: 'no_parentId',
//         sheetId: 'sheet1',
//         type: 'box',
//         styles: {},
//       },
//     ] as ViewItem[];

//     const result = organizeViewItemsIntoEntities(items);
//     expect(result['1'].children).toEqual({});
//   });
// });

// // npm run test:unit dev-organize-vi-into-entities.test.ts
