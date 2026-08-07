
/**
 * v.2023-05-08
 * True if the data has this field
 */
export const isHasField = (data: Object, field: string): boolean =>
  Boolean(data?.hasOwnProperty(field));

export const isNotHasField = (data: Object, field: string): boolean => ! isHasField(data, field);
