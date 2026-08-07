import { getConditionKod } from '..';

// Эти тесты покрывают:
//  - Возврат оригинального кода, когда тип не "condition"
//  - Возврат оригинального кода, когда код пустой
//  - Добавление суффикса "-C" для типа "condition", если его нет
//  - Сохранение кода без изменений, если суффикс уже есть
//  - Некоторые граничные случаи

describe('getConditionKod', () => {
  it('should return original kod when type is not "condition"', () => {
    expect(getConditionKod('company', '123')).toBe('123');
    // @ts-ignore
    expect(getConditionKod('', '456')).toBe('456');
    // @ts-ignore
    expect(getConditionKod(undefined, '789')).toBe('789');
  });

  it('should return original kod when kod is empty', () => {
    expect(getConditionKod('condition', '')).toBe('');
    // @ts-ignore
    expect(getConditionKod('condition', null)).toBe(null);
    // @ts-ignore
    expect(getConditionKod('condition', undefined)).toBe(undefined);
  });

  it('should return kod with "-C" suffix when type is "condition" and kod does not end with "-C"', () => {
    expect(getConditionKod('condition', '123')).toBe('123-C');
    expect(getConditionKod('condition', 'TEST')).toBe('TEST-C');
    expect(getConditionKod('condition', 'CODE-1')).toBe('CODE-1-C');
  });

  it('should return original kod when type is "condition" and kod already ends with "-C"', () => {
    expect(getConditionKod('condition', '123-C')).toBe('123-C');
    expect(getConditionKod('condition', 'TEST-C')).toBe('TEST-C');
    expect(getConditionKod('condition', 'CODE-C')).toBe('CODE-C');
  });

  it('should handle edge cases', () => {
    expect(getConditionKod('condition', '-C')).toBe('-C');
    expect(getConditionKod('condition', 'C')).toBe('C-C');
    expect(getConditionKod('condition', ' ')).toBe(' -C');
  });
});

// npm run test:unit get-condition-kod.test.ts
