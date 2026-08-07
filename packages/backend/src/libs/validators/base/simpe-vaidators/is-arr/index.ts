
/** Returns true if arr is Array */
export function isArr<A>(arr: A[]): boolean {
  return Array.isArray(arr);
}

export function isNotArr<A>(arr: A[]): boolean {
  return ! isArr(arr);
}
