// packages/backend/src/shared/utils/objects/filter-ents-by-field/tests/types.ts

export interface Item extends Record<string, unknown> {
  id: string;
  name: string;
  value: boolean;
  data: {
    foo: string;
    bae: number;
  };
  arr?: string[];
}

export interface Entities<O extends object> {
  [id: string]: O;
}

interface MockItem<O extends object> {
  description: string;
  entities: Entities<O>;
  field: string;
  value: string | string[];
  includes?: boolean;
  validFunc?: (ent: Record<string, unknown>, value: string) => boolean;
}

type MockResult<O extends object> = Entities<O>;

interface Mock<O extends object> extends Array<MockItem<O> | MockResult<O>> {
  0: MockItem<O>;
  1: MockResult<O>;
}

export type Mocks<O extends object> = Array<Mock<O>>;
