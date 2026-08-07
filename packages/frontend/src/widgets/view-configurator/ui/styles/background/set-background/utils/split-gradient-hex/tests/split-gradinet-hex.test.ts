import { splitGradinetHex } from '..';


describe('splitGradinetHex', () => {
  test('data is undefined', () => {
    expect(splitGradinetHex(undefined as unknown as string)).toEqual([]);
  });

  test('invalid data', () => {
    expect(splitGradinetHex('#195d64b5f6'))
      .toEqual([]);
  });

  test('valid data', () => {
    expect(splitGradinetHex('linear-gradient(195deg, #bbdefb, #64b5f6)'))
      .toEqual(['195', '#bbdefb', '#64b5f6']);
  });
});

// npm run test:unit split-gradinet-hex.test.ts
