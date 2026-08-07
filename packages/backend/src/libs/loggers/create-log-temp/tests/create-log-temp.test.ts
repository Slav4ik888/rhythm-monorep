import { Context } from 'koa';
import { createLogTemp } from '..';


describe('createLogTemp', () => {
  const ctx = {
    state: {
      user: {
        id    : 'lnmqB8rgzNYFSRZ7STmE8U6YBlt2',
        email : 'korzan.va@mail.ru',
      }
    }
  } as Context;

  test('Valid data', () => {
    expect(createLogTemp(ctx, 'USER_TEST')).toEqual('[f]: USER_TEST [e]: korzan.va@mail.ru [u]: lnmqB8rgzNYFSRZ7STmE8U6YBlt2');
  });

  test('Valid data with value', () => {
    expect(createLogTemp(ctx, 'USER_TEST', 'some value'))
      .toEqual('[f]: USER_TEST [e]: korzan.va@mail.ru [u]: lnmqB8rgzNYFSRZ7STmE8U6YBlt2 [v]: some value');
  });

  test('Ctx is undefined', () => {
    expect(createLogTemp(undefined, 'USER_TEST')).toEqual('[f]: USER_TEST [u]: quest');
  });

  test('functionName is undefined', () => {
    expect(createLogTemp(ctx, undefined, 'some value'))
      .toEqual('[f]: undefined [e]: korzan.va@mail.ru [u]: lnmqB8rgzNYFSRZ7STmE8U6YBlt2 [v]: some value');
  });

  test('Ctx is a Email', () => {
    expect(createLogTemp('korzan.va@mail.ru' as unknown as Context, 'USER_TEST')).toEqual('[f]: USER_TEST [u]: quest');
  });
});

// npm run test:unit create-log-temp.test.ts
