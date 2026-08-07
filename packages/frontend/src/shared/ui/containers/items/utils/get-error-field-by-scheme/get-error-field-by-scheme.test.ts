import { getErrorFieldByScheme } from '..';


describe('getErrorFieldByScheme', () => {
  test('Scheme is undefined', () => {
    expect(getErrorFieldByScheme(undefined as unknown as string)).toEqual('');
  });
  test('1 lvl error', () => {
    expect(getErrorFieldByScheme('companyName')).toEqual('companyName');
  });
  test('2 lvl error', () => {
    expect(getErrorFieldByScheme('company.companyName')).toEqual('companyCompanyName');
  });
  test('5 lvl error', () => {
    expect(getErrorFieldByScheme('first.second.third.fourth.fifth')).toEqual('firstSecondThirdFourthFifth');
  });
});

// npm run test:unit get-error-field-by-scheme.test.ts
