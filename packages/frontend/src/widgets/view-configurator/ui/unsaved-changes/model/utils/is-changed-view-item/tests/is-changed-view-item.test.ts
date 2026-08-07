import { isNotEmpty } from 'shared/helpers/objects';
import { isChangedViewItem } from '..';


describe('isChangedViewItem', () => {
  test('TC01 should return false when selectedId is falsy and all objects are empty', () => {
    const result = isChangedViewItem('', {}, {});
    expect(result).toBe(false);
  });

  test('TC02 should return true when changedCompany is not empty', () => {
    // @ts-ignore
    const result = isChangedViewItem('1', { name: 'Test' }, {});
    expect(result).toBe(true);
  });

  test('TC03 should return true and log when changedViewItem is not empty', () => {
    // @ts-ignore
    const result = isChangedViewItem('1', {}, { name: 'ViewItem' });
    expect(result).toBe(true);
  });

  test('TC04 should return false when all conditions are not met', () => {
    const result = isChangedViewItem('1', {}, {});
    expect(result).toBe(false);
  });

  test('TC05 should return false when selectedId is empty string', () => {
    // @ts-ignore
    const result = isChangedViewItem('', { name: 'Test' }, {});
    expect(result).toBe(false);
  });

  test('TC06 should return true when changedViewItem has value but changedCompany is null', () => {
    // @ts-ignore
    const result = isChangedViewItem('1', null, { id: '2' });
    expect(result).toBe(true);
  });

  test('TC07 should return false when both changedCompany and changedViewItem are null or undefined', () => {
    // @ts-ignore
    const result = isChangedViewItem('1', null, undefined);
    expect(result).toBe(false);
  });
});

// npm run test:unit is-changed-view-item.test.ts
