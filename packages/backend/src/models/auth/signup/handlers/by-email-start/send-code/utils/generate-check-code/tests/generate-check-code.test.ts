import { generateCheckCode } from '..';


describe('generateCheckCode', () => {
  it('should return a string of length 6', () => {
    const code = generateCheckCode();
    expect(code).toHaveLength(6);
  });

  it('should return only digits', () => {
    const code = generateCheckCode();
    expect(code).toMatch(/^\d{6}$/);
  });

  it('should return value between 100000 and 999999', () => {
    const code = generateCheckCode();
    const num = parseInt(code, 10);
    expect(num).toBeGreaterThanOrEqual(100000);
    expect(num).toBeLessThanOrEqual(999999);
  });

  it('should return different values on subsequent calls', () => {
    const code1 = generateCheckCode();
    const code2 = generateCheckCode();
    expect(code1).not.toEqual(code2);
  });
});


// npm run test:unit generate-check-code.test.ts
