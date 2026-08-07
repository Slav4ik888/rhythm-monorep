import {toNumber} from '..';
import { mocks } from './mocks';


describe(`toNumber`, () => {
  mocks.forEach(m => it(m[0].description, () => {
    expect(toNumber(m[0].value)).toEqual(m[1]);
  }));
});

// npm run test to-number.test.ts
