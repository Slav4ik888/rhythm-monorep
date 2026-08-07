import { updateObject } from 'shared/helpers/objects';


const startObj = {
  f: {
    ff: 1,
    ss: 2,
    tt: {
      fff: 3,
      sss: {
        ffff: '4',
        ssss: 5,
      },
    }
  },
  s: {
    ff: 1,
    ss: 2,
    tt: {
      fff: 3,
      sss: {
        ffff: 4,
        ssss: 5,
        tttt: '6'
      },
      ttt: 7
    }
  }
}


const updatedObj = {
  f: {
    ff: '1',
    tt: {
      sss: {
        ffff: 8,
      },
    }
  },
  t: {
    ff: 1,
    ss: '2',
    tt: {
      fff: 3,
      sss: {
        ffff: 4,
        ssss: 5,
        tttt: 6
      },
      ttt: 7
    }
  }
}



describe('updateObject', () => {
  test('updateObject', () => {
    const obj = updateObject(startObj, updatedObj);
    // старые без изменений сохранены
    expect(obj.f.ss).toEqual(2);
    expect(obj.f.tt.sss.ssss).toEqual(5);
    expect(obj.s.tt.sss.tttt).toEqual('6');
    expect(obj.s.tt.ttt).toEqual(7);

    // старые с изменениями
    expect(obj.f.ff).toEqual('1');
    expect(obj.f.tt.sss.ffff).toEqual(8);

    // новые данные
    // @ts-ignore
    expect(obj.t.ff).toEqual(1);
    // @ts-ignore
    expect(obj.t.ss).toEqual('2');
    // @ts-ignore
    expect(obj.t.tt.sss.tttt).toEqual(6);
    // @ts-ignore
    expect(obj.t.tt.ttt).toEqual(7);
  });
});

// npm run test:unit join-obj.test.ts
