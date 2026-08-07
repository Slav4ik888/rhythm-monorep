import { splitGradinetRgba } from '..';


describe('splitGradinetRgba', () => {
  test('data is undefined', () => {
    expect(splitGradinetRgba(undefined as unknown as string)).toEqual([]);
  });

  test('invalid data', () => {
    expect(splitGradinetRgba('#195d64b5f6'))
      .toEqual([]);
  });

  test('valid data', () => {
    expect(splitGradinetRgba('linear-gradient(195deg, rgba(255, 255, 255, 1), rgba(0, 0, 0, 1))'))
      .toEqual(['195', 'rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)']);
  });
});

// npm run test:unit split-gradinet-rgba.test.ts
