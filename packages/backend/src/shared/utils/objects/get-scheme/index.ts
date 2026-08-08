// packages/backend/src/shared/utils/objects/get-scheme/index.ts

interface Scheme {
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

/**
 * @deprecated
 */
export function getScheme(str: string): Scheme {
  const values = {
    field1: '',
    field2: '',
    field3: '',
    field4: '',
  };

  if (!str) return values;

  const split = str.split('.');

  const [field1, field2, field3, field4] = split;
  values.field1 = field1;
  values.field2 = field2;
  values.field3 = field3;
  values.field4 = field4;

  return values;
}
