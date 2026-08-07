// import { userActions } from 'entities/user';
import { Company } from 'entities/company';
import { User } from 'entities/user';
import { TestAsyncThunk } from 'shared/lib/tests';
import { authByLogin, ResAuthByLogin } from '.';



describe('authByLogin', () => {
  test('Succes login', async () => {
    const data: ResAuthByLogin = {
      user    : {  id: '1', name: 'test' } as unknown as User,
      company : {  id: '1', name: 'test' } as unknown as Company,
      message : 'success'
    };

    const thunk = new TestAsyncThunk(authByLogin);
    // @ts-ignore
    thunk.api.post.mockReturnValue(Promise.resolve({ data }));

    const result = await thunk.callThunk({ email: 'user@mail.ru', password: '123456' });

    // expect(thunk.dispatch).toHaveBeenCalledWith(userActions.setAuthenticated(true));
    // expect(thunk.dispatch).toHaveBeenCalledWith(getUserAndCompany());
    expect(thunk.dispatch).toHaveBeenCalledTimes(3);
    expect(thunk.api.post).toHaveBeenCalled();
    expect(result.meta.requestStatus).toBe('fulfilled');
    expect(result.payload).toEqual(undefined); // { status: 'success' });
  });


  test('Error login', async () => {
    // const data: ResAuthByLogin = {
    //   general: 'Данный аккаунт отключен. Обратитесь в службу технической поддержки.'
    // };

    const thunk = new TestAsyncThunk(authByLogin);

    // @ts-ignore
    thunk.api.post.mockReturnValue(Promise.reject());// { data }));

    const result = await thunk.callThunk({ email: '123', password: '123' });


    expect(thunk.dispatch).toHaveBeenCalledTimes(2);
    expect(thunk.api.post).toHaveBeenCalled();
    expect(result.meta.requestStatus).toBe('rejected');
    expect(result.type).toBe('login/authByLogin/rejected');
  });
});


// npm run test:unit auth-by-email.test.ts
