import { isValidPartnerId } from '..';


describe('isValidPartnerId', () => {
  test('Valid PartnerCode', () => expect(isValidPartnerId('azbuka')).toEqual(true));
  test('Invalid PartnerCode', () => expect(isValidPartnerId('Invalid')).toEqual(false));
  // @ts-ignore
  test('PartnerCode is undefined', () => expect(isValidPartnerId(undefined)).toEqual(false));
  test('PartnerCode is empty', () => expect(isValidPartnerId('')).toEqual(false));
  test('PartnerCode is true', () => expect(isValidPartnerId(true as unknown as string)).toEqual(false));
});

// npm run test:unit is-valid-partner-id.test.ts
