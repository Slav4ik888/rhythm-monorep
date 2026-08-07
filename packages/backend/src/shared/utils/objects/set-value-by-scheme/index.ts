import { isUndefined } from '../../../../libs/validators';

/**
 * Set into Obj value in object by scheme
 * max вложенность = 8
 * v.2023-05-15
 */
export function setValueByScheme<O extends object>(obj: O, scheme: string, value: any) {
  if (! obj || ! scheme) return undefined;

  const
    fields = scheme.split('.');

  const check2Field = (obj: object, fields: string[]) => {
  // @ts-ignore
    if (isUndefined(obj[fields[0]])) {
  // @ts-ignore
      obj[fields[0]] = {};
    }
  };

  const check3Field = (obj: object, fields: string[]) => {
    check2Field(obj, fields);
  // @ts-ignore
    if (isUndefined(obj[fields[0]][fields[1]])) {
  // @ts-ignore
      obj[fields[0]][fields[1]] = {};
    }
  };

  const check4Field = (obj: object, fields: string[]) => {
    check3Field(obj, fields);
  // @ts-ignore
    if (isUndefined(obj[fields[0]][fields[1]][fields[2]])) {
  // @ts-ignore
      obj[fields[0]][fields[1]][fields[2]] = {};
    }
  };

  const check5Field = (obj: object, fields: string[]) => {
    check4Field(obj, fields);
  // @ts-ignore
    if (isUndefined(obj[fields[0]][fields[1]][fields[2]][fields[3]])) {
  // @ts-ignore
      obj[fields[0]][fields[1]][fields[2]][fields[3]] = {};
    }
  };

  const check6Field = (obj: object, fields: string[]) => {
    check5Field(obj, fields);
  // @ts-ignore
    if (isUndefined(obj[fields[0]][fields[1]][fields[2]][fields[3]][fields[4]])) {
  // @ts-ignore
      obj[fields[0]][fields[1]][fields[2]][fields[3]][fields[4]] = {};
    }
  };

  const check7Field = (obj: object, fields: string[]) => {
    check6Field(obj, fields);
  // @ts-ignore
    if (isUndefined(obj[fields[0]][fields[1]][fields[2]][fields[3]][fields[4]][fields[5]])) {
  // @ts-ignore
      obj[fields[0]][fields[1]][fields[2]][fields[3]][fields[4]][fields[5]] = {};
    }
  };

  const check8Field = (obj: object, fields: string[]) => {
    check7Field(obj, fields);
  // @ts-ignore
    if (isUndefined(obj[fields[0]][fields[1]][fields[2]][fields[3]][fields[4]][fields[5]][fields[6]])) {
  // @ts-ignore
      obj[fields[0]][fields[1]][fields[2]][fields[3]][fields[4]][fields[5]][fields[6]] = {};
    }
  };



  switch (fields.length) {
    case 8:
      check8Field(obj, fields);
  // @ts-ignore
      obj[fields[0]][fields[1]][fields[2]][fields[3]][fields[4]][fields[5]][fields[6]][fields[7]] = value
      break;
    
    case 7:
      check7Field(obj, fields);
  // @ts-ignore
      obj[fields[0]][fields[1]][fields[2]][fields[3]][fields[4]][fields[5]][fields[6]] = value
      break;

    case 6:
      check6Field(obj, fields);
  // @ts-ignore
      obj[fields[0]][fields[1]][fields[2]][fields[3]][fields[4]][fields[5]] = value
      break;

    case 5:
      check5Field(obj, fields);
  // @ts-ignore
      obj[fields[0]][fields[1]][fields[2]][fields[3]][fields[4]] = value
      break;

    case 4:
      check4Field(obj, fields);
  // @ts-ignore
      obj[fields[0]][fields[1]][fields[2]][fields[3]] = value
      break;

    case 3:
      check3Field(obj, fields);
  // @ts-ignore
      obj[fields[0]][fields[1]][fields[2]] = value
      break;

    case 2:
      check2Field(obj, fields);
  // @ts-ignore
      obj[fields[0]][fields[1]] = value;
      break;

    case 1:
  // @ts-ignore
      obj[fields[0]] = value;
      break;

  }
}
