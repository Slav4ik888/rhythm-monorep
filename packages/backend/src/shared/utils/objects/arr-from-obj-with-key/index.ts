// packages/backend/src/shared/utils/objects/arr-from-obj-with-key/index.ts

export function arrFromObjWithKey<O>(obj: O): Array<O & { key: string }> {
  const arr = [];

  Object.keys(obj).forEach((key) => {
    const newObj = {
      key: [key],
      // @ts-ignore
      ...obj[key],
    };
    arr.push(newObj);
  });
  // @ts-ignore
  return arr;
}
