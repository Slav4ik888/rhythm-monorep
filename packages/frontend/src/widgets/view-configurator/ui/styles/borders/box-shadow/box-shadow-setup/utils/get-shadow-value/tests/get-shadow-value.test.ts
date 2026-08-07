import { getBoxShadowValue } from '..';


describe('getBoxShadowValue', () => {
  test('getBoxShadowValue', () => {
    const value = '5px 1px 3px 0px rgba(184, 184, 184, 1)';

    expect(getBoxShadowValue(0, value)).toEqual(5);
    expect(getBoxShadowValue(1, value)).toEqual(1);
    expect(getBoxShadowValue(2, value)).toEqual(3);
    expect(getBoxShadowValue(3, value)).toEqual(0);
    expect(getBoxShadowValue(4, value)).toEqual('rgba(184, 184, 184, 1)');
    expect(getBoxShadowValue(10, value)).toEqual('rgba(184, 184, 184, 1)');
  });
});

// npm run test:unit get-shadow-value.test.ts
