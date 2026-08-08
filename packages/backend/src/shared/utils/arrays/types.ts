// packages/backend/src/shared/utils/arrays/types.ts

export type Item = object & { [k: string]: unknown };

export type Items = Item[] | string[] | number[];

export type Entities<O extends object = Record<string, unknown>> = Record<string, O>;
