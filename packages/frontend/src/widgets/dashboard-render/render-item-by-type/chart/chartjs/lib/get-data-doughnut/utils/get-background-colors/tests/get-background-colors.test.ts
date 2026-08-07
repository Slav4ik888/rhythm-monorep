import { ViewItem } from 'entities/dashboard-view';
import { getBackgroundColors, TEMPLATE_COLORS } from '..';


describe('getBackgroundColors', () => {
  test('valid data', () => {
    const item = {
      settings: {
        charts: [{
          datasets: {
            backgroundColor: '123'
          }
        }, {
          datasets: {
            backgroundColor: '456'
          }
        }]
      }
    }
    expect(getBackgroundColors(item as ViewItem)).toEqual(['123', '456']);
  });

  test('invalid data', () => {
    // @ts-ignore
    expect(getBackgroundColors(undefined)).toEqual(TEMPLATE_COLORS);
  });
});

// npm run test:unit get-background-colors.test.ts
