import { setValueByScheme } from '..';
import { cloneObj } from '../../objects';

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



describe('setValueByScheme', () => {
  test('Set to nesting depth 4', () => {
    const CLONE_MOCK = cloneObj(MOCK);
    setValueByScheme(CLONE_MOCK, 'first.second.third.fourth', { newField: '123 ' })
    expect(CLONE_MOCK.first.second.third.fourth).toEqual({ newField: '123 ' });
  });

  test('Set to nesting depth 4 without fields by scheme', () => {
    const CLONE_MOCK = cloneObj(MOCK);
    setValueByScheme(CLONE_MOCK, 'non_first.non_second.non_third.non_fourth', { newField: '123 ' });

    // @ts-ignore
    expect(CLONE_MOCK.first.second.third.fourth.any).toEqual({ any: {} });
    // @ts-ignore
    expect(CLONE_MOCK.non_first.non_second.non_third.non_fourth).toEqual({ newField: '123 ' });
  });

  test('Set to nesting depth 8 without first field by scheme', () => {
    const CLONE_MOCK = cloneObj(MOCK);
    setValueByScheme(CLONE_MOCK, 'non_first.second.third.fourth.fifth.sixs.sevens.eights', { newField: '123 ' });

    // @ts-ignore
    expect(CLONE_MOCK.first.second.third.fourth.any).toEqual({ any: {} });
    // @ts-ignore
    expect(CLONE_MOCK.non_first.second.third.fourth.fifth.sixs.sevens.eights).toEqual({ newField: '123 ' });
  });


  test('Set to nesting depth 8 without 4 field by scheme', () => {
    const CLONE_MOCK = cloneObj(MOCK);
    setValueByScheme(CLONE_MOCK, 'first.second.third.non_fourth.fifth.sixs.sevens.eights', { newField: '123 ' });

    // @ts-ignore
    expect(CLONE_MOCK.first.second.third.fourth.any).toEqual({ any: {} })
    // @ts-ignore
    expect(CLONE_MOCK.first.second.third.non_fourth.fifth.sixs.sevens.eights).toEqual({ newField: '123 ' });
  });
});

// npm run test:unit set-value-by-scheme.test.ts
