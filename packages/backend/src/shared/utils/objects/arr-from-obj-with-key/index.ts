
export function arrFromObjWithKey<O>(obj: O): Array<O & { key: string }> {
  const arr = [];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newObj = {
        key: [key],
        ...obj[key]
      }
      arr.push(newObj);
    }
  }
  // @ts-ignore
  return arr;
};
