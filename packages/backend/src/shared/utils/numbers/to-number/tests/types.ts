
interface MockItem {
  description : string;
  value       : any;
};

interface Mock extends Array<MockItem | number> {
  0: MockItem;
  1: number;
};

export type Mocks = Array<Mock>;
