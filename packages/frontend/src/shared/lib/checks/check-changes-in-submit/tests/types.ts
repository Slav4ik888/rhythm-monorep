
interface MockItem<O> {
  storeData : O;
  newData   : O;
  exit      : boolean;
}

interface MockResult {
  res: boolean;
  open: boolean;
  close: boolean;
  confirm: boolean;
}

interface Mock extends Array<MockItem<any> | MockResult> {
  0: MockItem<any>;
  1: MockResult;
}

export type Mocks = Array<Mock>;
