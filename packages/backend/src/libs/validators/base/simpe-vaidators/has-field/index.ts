// packages/backend/src/libs/validators/base/simpe-vaidators/has-field/index.ts

/**
 * v.2023-05-08
 * True if the data has this field
 */
export const isHasField = (data: object, field: string): boolean =>
  Boolean(Object.prototype.hasOwnProperty.call(data, field));

export const isNotHasField = (data: object, field: string): boolean => !isHasField(data, field);
