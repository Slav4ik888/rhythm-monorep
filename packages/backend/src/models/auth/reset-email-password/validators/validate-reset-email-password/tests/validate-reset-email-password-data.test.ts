import { validateResetEmailPassword } from '..';
import { Context } from '../../../../../../app/types/global';
import { CtxClass } from '../../../../../../libs/tests';



describe('validateResetEmailPassword', () => {
  it('Valid data', () => {
    const
      mockFn = jest.fn(),
      ctx = new CtxClass(mockFn) as unknown as Context;

    validateResetEmailPassword(ctx, 'korzan.va@mail.ru');

    expect(mockFn).toBeCalledTimes(0);
    expect(ctx.status).toBe(200);
  });

  it('Empty', () => {
    const
      mockFn = jest.fn(),
      ctx = new CtxClass(mockFn) as unknown as Context;

    validateResetEmailPassword(ctx, '');

    expect(mockFn).toBeCalledTimes(1);
    expect(ctx.status).toBe(400);
  });

  it('Invalid email', () => {
    const
      mockFn = jest.fn(),
      ctx = new CtxClass(mockFn) as unknown as Context;

    validateResetEmailPassword(ctx, 'korzan.va@mail');

    expect(mockFn).toBeCalledTimes(1);
    expect(ctx.status).toBe(400);
  });
});


// npm run test:unit validate-reset-email-password-data.test.ts
