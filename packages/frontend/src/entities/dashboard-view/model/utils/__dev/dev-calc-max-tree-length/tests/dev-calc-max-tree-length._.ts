// import { ViewItem } from '../../../../types';
// import { devCalcMaxTreeLength } from '..';
// import { organizeViewItemsIntoEntities } from '../../../organize-vi-into-entities';


// describe('devCalcMaxTreeLength', () => {
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

//     { id: 'child1-2', parentId: 'child1' },
//     { id: 'child1-2-1', parentId: 'child1-2' },
//     { id: 'child1-2-1-1', parentId: 'child1-2-1' },
//     { id: 'child1-2-1-1-1', parentId: 'child1-2-1-1' },
//     { id: 'child1-2-1-1-1-1', parentId: 'child1-2-1-1-1' },
//     { id: 'child1-2-1-1-1-1-1', parentId: 'child1-2-1-1-1-1' },
//     { id: 'child1-2-1-1-1-1-1-1', parentId: 'child1-2-1-1-1-1-1' },

//     // В ширину
//     { id: 'root2', parentId: 'no_parentId' },
//     { id: 'child2–1', parentId: 'root2' },
//     { id: 'child2-2', parentId: 'root2' },
//     { id: 'child2-3', parentId: 'root2' },

//     // Одинокий
//     { id: 'root3', parentId: 'no_parentId' },
//   ] as ViewItem[];


//   const entities = organizeViewItemsIntoEntities(tree);

//   test('should return max tree length', () => {
//     expect(devCalcMaxTreeLength(entities.root1, tree)).toEqual(8);
//     expect(devCalcMaxTreeLength(entities.root2, tree)).toEqual(2);
//     expect(devCalcMaxTreeLength(entities.root3, tree)).toEqual(1);
//   });
// });

// // npm run test:unit dev-calc-max-tree-length.test.ts
