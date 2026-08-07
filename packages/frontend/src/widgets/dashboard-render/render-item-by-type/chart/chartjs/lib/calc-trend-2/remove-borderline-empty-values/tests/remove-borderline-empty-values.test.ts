import { removeBorderlineEmptyValues } from '..';


describe('removeBorderlineEmptyValues', () => {
  test('Valid array', () => {
    expect(removeBorderlineEmptyValues([NaN, NaN, 0, 10, 20, 80, NaN, 40, 50, 0, 0, NaN, NaN, NaN])).toEqual([0, 10, 20, 80, NaN, 40, 50, 0, 0]);
  });

  test('One value in array', () => {
    expect(removeBorderlineEmptyValues(['', NaN, 0, NaN])).toEqual([0]);
  });

  test('Invalid array', () => {
    expect(removeBorderlineEmptyValues([NaN, NaN, NaN])).toEqual([]);
  });
});

// npm run test:unit remove-borderline-empty-values.test.ts
