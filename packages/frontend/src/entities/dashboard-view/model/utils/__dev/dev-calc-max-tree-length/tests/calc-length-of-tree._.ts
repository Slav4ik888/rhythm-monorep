// import { ViewItem } from '../../../../types';
// import { calcLengthOfTree } from '..';



// describe('calcLengthOfTree', () => {
//   const tree = [
//     // В глубину и ширину
//     { id: 'root1', parentId: 'no_parentId' },
//     { id: 'child1', parentId: 'root1' },
//     { id: 'child1-1', parentId: 'child1' },
//     { id: 'child1-1-1', parentId: 'child1-1' },
//     { id: 'child1-1-1-1', parentId: 'child1-1-1' },
//     { id: 'child1-1-1-2', parentId: 'child1-1-1' },
//     { id: 'child1-1-1-3', parentId: 'child1-1-1' },
//     { id: 'child1-1-1-1-1', parentId: 'child1-1-1-1' },
//     { id: 'child1-1-1-1-1-1', parentId: 'child1-1-1-1-1' },

//     // В ширину
//     { id: 'root2', parentId: 'no_parentId' },
//     { id: 'child2–1', parentId: 'root2' },
//     { id: 'child2-2', parentId: 'root2' },
//     { id: 'child2-3', parentId: 'root2' },

//     // Одинокий
//     { id: 'root3', parentId: 'no_parentId' },
//   ] as ViewItem[];

//   const byId = (id: string) => tree.find(item => item.id === id);


//   test('should calculated tree depth', () => {
//     expect(calcLengthOfTree(tree[0], tree)).toEqual(7);
//     expect(calcLengthOfTree(byId('child1'), tree)).toEqual(6);

//     expect(calcLengthOfTree(byId('root2'), tree)).toEqual(2);
//     expect(calcLengthOfTree(byId('root3'), tree)).toEqual(1);
//   });

//   test('Item is undefined ', () => {
//     expect(calcLengthOfTree(undefined, tree)).toEqual(0);
//   });
// });

// // npm run test:unit calc-length-of-tree.test.ts
