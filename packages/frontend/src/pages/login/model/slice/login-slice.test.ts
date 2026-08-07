import { reducer, actions } from '.';
import { StateSchemaLoginPage } from '../types/state-schema';


describe('loginSlice', () => {
  test('setErrors', () => {
    const state: DeepPartial<StateSchemaLoginPage> = { errors: {} };

    expect(reducer(state as StateSchemaLoginPage, actions.setErrors({ email: 'Wrong email' })))
      .toEqual({ errors: { email: 'Wrong email' } });
  });

  test('clearErrors', () => {
    const state: DeepPartial<StateSchemaLoginPage> = { errors: { email: 'Wrong email' } };

    expect(reducer(state as StateSchemaLoginPage, actions.clearErrors()))
      .toEqual({ errors: {} });
  });
  // test('set clearEmailAndPassword', () => {
  //   const state: DeepPartial<StateSchemaLoginPage> = {
  //     email    : 'user@mail.ru',
  //     password : '123',
  //     errors   : { email: 'Wrong email' }
  //   };

  //   expect(reducer(state as StateSchemaLoginPage, actions.clearEmailAndPassword()))
  //     .toEqual({ email: '', password: '', errors: undefined });
  // });
});

// npm run test:unit login-slice.test.ts
