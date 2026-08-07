import { getValueByScheme } from '..';

const MOCK = {
  first: {
    second: {
      third: {
        fourth: {
          fifth: {
            sixs: {
              sevens: {
                eights: {
                  field: 'some field'
                }
              },
              any: {
                any: {}
              }
            }
          },
          any: {
            any: {}
          }
        }
      }
    },
    any: {
      any: {}
    }
  },
  any: {
    any: {}
  }
};


describe('getValueByScheme', () => {
  test('Nesting depth 7', () => {
    expect(getValueByScheme(MOCK, 'first.second.third.fourth.fifth.sixs.sevens'))
      .toEqual({
        eights: {
          field: 'some field'
        }
      });
  });

  test('Nesting depth 8', () => {
    expect(getValueByScheme(MOCK, 'first.second.third.fourth.fifth.sixs.sevens.eights'))
      .toEqual({
        field:
          'some field'
      });
  });

  test('Nesting depth 8 wuth 7 elem is undefined', () => {
    expect(getValueByScheme(MOCK, 'first.second.third.fourth.fifth.sixs.notSevens.eights'))
      .toEqual(undefined);
  });

  test('scheme is invalid', () => {
    // @ts-ignore
    expect(getValueByScheme(undefined, 'first.second.third.someField'))
      .toEqual(undefined);
  });

  test('obj is undefined', () => {
    // @ts-ignore
    expect(getValueByScheme(undefined, 'first.second.third.fourth.fifth.sixs.sevens.eights'))
      .toEqual(undefined);
  });

  test('scheme is undefined', () => {
    // @ts-ignore
    expect(getValueByScheme(MOCK, undefined))
      .toEqual(undefined);
  });

  test('scheme length > max depth', () => {
    expect(getValueByScheme(MOCK, 'first.second.third.fourth.fifth.sixs.sevens.eights.nines'))
      .toEqual(undefined);
  });
});

// npm run test:utils get-value-by-scheme.test.ts
