import { SignupData } from '../../../types';
import { validateSignupDataEnd } from '..';
import { MOCK_SIGNUP_DATA_END } from '../../../mocks';
import { getMockStrLength } from '../../../../../../shared/utils/strings';
import { CtxClass } from '../../../../../../libs/tests';
import { Context } from 'koa';



describe('validateSignupDataEnd', () => {
  it('Valid with required data', () => {
    const
      mockFn = jest.fn(),
      ctx    = new CtxClass(mockFn) as unknown as Context;

    validateSignupDataEnd(ctx, MOCK_SIGNUP_DATA_END);
    expect(mockFn).toBeCalledTimes(0);
    expect(ctx.status).toBe(200);
    expect(ctx.errors).toEqual({});
  });

  it('Invalid with required data', () => {
    const
      mockFn = jest.fn(),
      ctx    = new CtxClass(mockFn) as unknown as Context;

    validateSignupDataEnd(ctx, {
      email     : '',
      emailCode : '',
    });

    expect(mockFn).toBeCalledTimes(1);
    expect(ctx.status).toEqual(400);
    expect(ctx.errors).toEqual({
      email     : 'Не верный формат данных, для поля "email".',
      emailCode : 'Поле "emailCode" не должно быть меньше 6 символов.',
    });
  });

  it('emailCode > 6 letters', () => {
    const
      mockFn = jest.fn(),
      ctx    = new CtxClass(mockFn) as unknown as Context;

    validateSignupDataEnd(ctx, {
      email     : MOCK_SIGNUP_DATA_END.email,
      emailCode : '1234567',
    });

    expect(mockFn).toBeCalledTimes(1);
    expect(ctx.status).toEqual(400);
    expect(ctx.errors).toEqual({
      emailCode : 'Поле "emailCode" не должно быть больше 6 символов.',
    });
  });

});

// npm run test:unit validate-signup-data-end.test.ts
