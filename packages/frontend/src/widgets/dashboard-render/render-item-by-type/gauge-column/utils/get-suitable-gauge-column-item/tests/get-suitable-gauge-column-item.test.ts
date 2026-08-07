import { GaugeColumnItem } from 'entities/dashboard-view';
import { getSuitableGaugeColumnItem } from '..';


describe('getSuitableGaugeColumnItem', () => {
  const testItems: GaugeColumnItem[] = [
    { label: 'Low',     color: 'red',    valueLess: 10 },
    { label: 'Medium',  color: 'yellow', valueMore: 10, valueLess: 20 },
    { label: 'High',    color: 'green',  valueMore: 20 },
    { label: 'Invalid', color: 'gray',   valueMore: '', valueLess: '' },
  ];

  it('should return undefined for empty array', () => {
    expect(getSuitableGaugeColumnItem(5, [])).toBeUndefined();
  });

  it('should find item with only valueLess condition', () => {
    const result = getSuitableGaugeColumnItem(5, testItems);
    expect(result).toEqual({ label: 'Low', color: 'red', valueLess: 10 });
  });

  it('should find item with both valueMore and valueLess conditions (range)', () => {
    const result = getSuitableGaugeColumnItem(15, testItems);
    expect(result).toEqual({ label: 'Medium', color: 'yellow', valueMore: 10, valueLess: 20 });
  });

  it('should find item with only valueMore condition', () => {
    const result = getSuitableGaugeColumnItem(25, testItems);
    expect(result).toEqual({ label: 'High', color: 'green', valueMore: 20 });
  });

  it('should ignore items with empty string conditions', () => {
    const result = getSuitableGaugeColumnItem(100, testItems);
    expect(result).toEqual({ label: 'High', color: 'green', valueMore: 20 });
  });

  it('should return undefined when no conditions match', () => {
    const customItems: GaugeColumnItem[] = [
      { label: 'Test', valueMore: 100 },
    ];
    expect(getSuitableGaugeColumnItem(50, customItems)).toBeUndefined();
  });

  it('should handle string number conditions (coerce to numbers)', () => {
    const customItems: GaugeColumnItem[] = [
      { label: 'StringNum', valueMore: '10', valueLess: '20' },
    ];
    const result = getSuitableGaugeColumnItem(15, customItems);
    expect(result).toEqual({ label: 'StringNum', valueMore: '10', valueLess: '20' });
  });

  it('should handle boundary values correctly', () => {
    expect(getSuitableGaugeColumnItem(10, testItems)).toEqual(
      { label: 'Medium', color: 'yellow', valueMore: 10, valueLess: 20 }
    );
    expect(getSuitableGaugeColumnItem(20, testItems)).toEqual(
      { label: 'High', color: 'green', valueMore: 20 }
    );
  });

  it('should return first matching item when multiple items match', () => {
    const customItems: GaugeColumnItem[] = [
      { label: 'First', valueLess: 100 },
      { label: 'Second', valueLess: 50 },
    ];
    const result = getSuitableGaugeColumnItem(25, customItems);
    expect(result?.label).toBe('First');
  });
});

describe('getSuitableGaugeColumnItem 2', () => {
  const testItems: GaugeColumnItem[] = [
    { label: 'Low',     color: 'red',    valueLess: 10, valueMore: '' },
    { label: 'Medium',  color: 'yellow', valueMore: 10, valueLess: '' },
    { label: 'High',    color: 'green',  valueMore: 20, valueLess: ''  },
  ];

  it('should find item with valueLess = "" (range)', () => {
    const result = getSuitableGaugeColumnItem(15, testItems);
    expect(result?.color).toEqual('yellow');
  });

  it('should find first item valid of condition', () => {
    const result = getSuitableGaugeColumnItem(25, testItems);
    expect(result?.color).toEqual('yellow');
  });

  it('should handle boundary values correctly', () => {
    expect(getSuitableGaugeColumnItem(10, testItems)?.color).toEqual('yellow');
  });
});


describe('getSuitableGaugeColumnItem with empty conditions', () => {
  const itemsWithEmptyConditions: GaugeColumnItem[] = [
    { label: 'Low', color: 'red', valueLess: 10 },
    { label: 'Medium', color: 'yellow', valueMore: 10, valueLess: '' },
    { label: 'High', color: 'green', valueMore: 20 },
  ];

  it('should handle empty valueLess condition (treat as Infinity)', () => {
    const result = getSuitableGaugeColumnItem(15, itemsWithEmptyConditions);
    expect(result).toEqual({ label: 'Medium', color: 'yellow', valueMore: 10, valueLess: '' });
  });

  it('should handle empty valueMore condition (treat as -Infinity)', () => {
    const customItems: GaugeColumnItem[] = [
      { label: 'All', color: 'gray', valueMore: '', valueLess: 100 },
    ];
    const result = getSuitableGaugeColumnItem(50, customItems);
    expect(result).toEqual({ label: 'All', color: 'gray', valueMore: '', valueLess: 100 });
  });

  it('should ignore items with both empty conditions', () => {
    const customItems: GaugeColumnItem[] = [
      { label: 'Invalid', valueMore: '', valueLess: '' },
      { label: 'Valid', valueMore: 0, valueLess: 10 },
    ];
    const result = getSuitableGaugeColumnItem(5, customItems);
    expect(result).toEqual({ label: 'Valid', valueMore: 0, valueLess: 10 });
  });
});

// npm run test:unit get-suitable-gauge-column-item.test.ts
