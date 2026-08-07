import { isValidRGBA } from '..';


describe('isValidRGBA', () => {
  test('should return true for valid 4-character RGBA hex string', () => {
    expect(isValidRGBA('#FF00')).toBe(true);
    expect(isValidRGBA('#12ab')).toBe(true);
  });

  test('should return true for valid 8-character RGBA hex string', () => {
    expect(isValidRGBA('#FFFF0000')).toBe(true);
    expect(isValidRGBA('#12345678')).toBe(true);
  });

  test('should return false if string does not start with #', () => {
    expect(isValidRGBA('FF00')).toBe(false);
    expect(isValidRGBA('FFFF0000')).toBe(false);
  });

  test('should return false if length is not 5 or 9 characters', () => {
    expect(isValidRGBA('#FF')).toBe(false);      // 长度为3
    expect(isValidRGBA('#FF000')).toBe(false);   // 长度为6
    expect(isValidRGBA('#1234567')).toBe(false); // 长度为8
    expect(isValidRGBA('#123456789')).toBe(false); // 长度为10
  });

  test('should return false if contains non-hex characters', () => {
    expect(isValidRGBA('#GH00')).toBe(false);
    expect(isValidRGBA('#123Z5678')).toBe(false);
    expect(isValidRGBA('#12&45678')).toBe(false);
  });

  test('should return false for empty or invalid input', () => {
    expect(isValidRGBA('#')).toBe(false);
    expect(isValidRGBA('')).toBe(false);
    expect(isValidRGBA(null as any)).toBe(false);
    expect(isValidRGBA(undefined as any)).toBe(false);
  });
});

// npm run test:unit is-valid-rgba.test.ts
