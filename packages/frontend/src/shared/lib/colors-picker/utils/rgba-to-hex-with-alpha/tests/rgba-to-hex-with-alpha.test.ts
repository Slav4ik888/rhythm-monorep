import { rgbaToHexWithAlpha } from '..';


describe('rgbaToHexWithAlpha', () => {
  test('rgba(255, 100, 50, 0.5)', () => {
    expect(rgbaToHexWithAlpha('rgba(255, 100, 50, 0.5)')).toEqual('#ff643280');
  });
  test('rgba(0, 0, 255, 1))', () => {
    expect(rgbaToHexWithAlpha('rgba(0, 0, 255, 1))')).toEqual('#0000ffff');
  });
});

// npm run test:unit rgba-to-hex-with-alpha.test.ts
