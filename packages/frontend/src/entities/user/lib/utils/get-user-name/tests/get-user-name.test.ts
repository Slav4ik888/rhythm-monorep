import { getUserName } from '..';
import { mocks } from './mocks';


describe('getUserName', () => {
  mocks.forEach((m, i) => {
    it(m[0].description, () => {
      expect(getUserName(m[0].user))
        .toEqual(m[1])
    })
  })
})

// npm run test:unit get-user-name.test.ts
