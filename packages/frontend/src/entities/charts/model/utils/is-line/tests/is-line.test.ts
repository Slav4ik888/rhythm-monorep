import { ViewItem } from 'entities/dashboard-view';
import { isLine, isNotLine } from '..';



describe('Chart Type Checkers', () => {
  const mockLineChartItem = {
    settings: {
      charts: [
        { chartType: 'line' },
        { chartType: 'bar' }
      ]
    }
  } as ViewItem;

  const mockBarChartItem = {
    settings: {
      charts: [
        { chartType: 'bar' }
      ]
    }
  } as ViewItem;

  const mockUndefinedChartsItem = {
    settings: {}
  } as ViewItem;

  const mockUndefinedSettingsItem = {} as ViewItem;

  describe('isLine', () => {
    it('should return true for line chart at index 0', () => {
      expect(isLine(mockLineChartItem)).toBe(true);
    });

    it('should return false for non-line chart at index 0', () => {
      expect(isLine(mockBarChartItem)).toBe(false);
    });

    it('should return true for line chart at specified index', () => {
      expect(isLine(mockLineChartItem, 0)).toBe(true);
    });

    it('should return false for non-line chart at specified index', () => {
      expect(isLine(mockLineChartItem, 1)).toBe(false);
    });

    it('should return false when charts array is undefined', () => {
      expect(isLine(mockUndefinedChartsItem)).toBe(false);
    });

    it('should return false when settings is undefined', () => {
      expect(isLine(mockUndefinedSettingsItem)).toBe(false);
    });

    it('should return false when selectedItem is undefined', () => {
      expect(isLine(undefined)).toBe(false);
    });
  });

  describe('isNotLine', () => {
    it('should return false for line chart at index 0', () => {
      expect(isNotLine(mockLineChartItem)).toBe(false);
    });

    it('should return true for non-line chart at index 0', () => {
      expect(isNotLine(mockBarChartItem)).toBe(true);
    });

    it('should return false for line chart at specified index', () => {
      expect(isNotLine(mockLineChartItem, 0)).toBe(false);
    });

    it('should return true for non-line chart at specified index', () => {
      expect(isNotLine(mockLineChartItem, 1)).toBe(true);
    });

    it('should return true when charts array is undefined', () => {
      expect(isNotLine(mockUndefinedChartsItem)).toBe(true);
    });

    it('should return true when settings is undefined', () => {
      expect(isNotLine(mockUndefinedSettingsItem)).toBe(true);
    });

    it('should return true when selectedItem is undefined', () => {
      expect(isNotLine(undefined)).toBe(true);
    });

    it('should be negation of isLine', () => {
      const testCases = [
        mockLineChartItem,
        mockBarChartItem,
        mockUndefinedChartsItem,
        mockUndefinedSettingsItem,
        undefined
      ];

      testCases.forEach(item => {
        expect(isNotLine(item)).toBe(!isLine(item));
      });
    });
  });
});

// npm run test:unit is-line.test.ts
