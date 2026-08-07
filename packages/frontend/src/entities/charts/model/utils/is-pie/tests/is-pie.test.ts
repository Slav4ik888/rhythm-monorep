import { ViewItem } from 'entities/dashboard-view';
import { isPie } from '..';



describe('isPie', () => {
  it('should return true when chartType is "pie"', () => {
    const selectedItem = {
      settings: {
        charts: [
          { chartType: 'pie' }
        ]
      }
    } as ViewItem;
    expect(isPie(selectedItem)).toBe(true);
  });

  it('should return true when chartType is "doughnut"', () => {
    const selectedItem = {
      settings: {
        charts: [
          { chartType: 'doughnut' }
        ]
      }
    } as ViewItem;
    expect(isPie(selectedItem)).toBe(true);
  });

  it('should return false when chartType is other type', () => {
    const selectedItem = {
      settings: {
        charts: [
          { chartType: 'bar' }
        ]
      }
    } as ViewItem;
    expect(isPie(selectedItem)).toBe(false);
  });

  it('should return false when charts[0] is null', () => {
    const selectedItem = {
      settings: {
        charts: [null]
      }
    } as unknown as ViewItem;
    expect(isPie(selectedItem)).toBe(false);
  });

  it('should return false when charts is null', () => {
    const selectedItem = {
      settings: {
        charts: null
      }
    } as unknown as ViewItem;
    expect(isPie(selectedItem)).toBe(false);
  });

  it('should return false when settings is null', () => {
    const selectedItem = {
      settings: null
    } as unknown as ViewItem;
    expect(isPie(selectedItem)).toBe(false);
  });

  it('should return false when selectedItem is null (if allowed)', () => {
    // @ts-ignore
    expect(isPie(null)).toBe(false);
  });
});

// npm run test:unit is-pie.test.ts
