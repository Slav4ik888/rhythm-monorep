import { getSessionData } from '..';
import { cfg } from '../../../../../app/config';
import { Context } from '../../../../../app/types/global';
import { CtxClass } from '../../../../tests';


describe('getSessionData', () => {
  test('Valid cookie', () => {
    const
      mockFn = jest.fn(),
      ctx = new CtxClass(mockFn) as unknown as Context;
    
    ctx.headers = {};
    ctx.headers.cookie = `${cfg.COOKIE_NAME}=hrzUswUCkSUJjZanBRz79XIXB5l1/mother_fucker_987`;

    expect(getSessionData(ctx)).toEqual({
      userId: 'hrzUswUCkSUJjZanBRz79XIXB5l1',
      sessionCookie: 'mother_fucker_987'
    });
  });

  test('Invalid cookie', () => {
    const
      mockFn = jest.fn(),
      ctx = new CtxClass(mockFn) as unknown as Context;
    
    ctx.headers = {};
    ctx.headers.cookie = `${cfg.COOKIE_NAME}=hrzUswUCkSUJjZanBRz79XIXB5l1mother_fucker_987`;

    expect(getSessionData(ctx)).toEqual({
      userId: 'hrzUswUCkSUJjZanBRz79XIXB5l1mother_fucker_987',
      sessionCookie: undefined
    });
  });

  test('Cookie is undefined', () => {
    const
      mockFn = jest.fn(),
      ctx = new CtxClass(mockFn) as unknown as Context;
    
    ctx.headers = {};

    expect(getSessionData(ctx)).toEqual({
      userId: '',
      sessionCookie: ''
    });
  });
});

// npm run test:unit get-session-data.test.ts
