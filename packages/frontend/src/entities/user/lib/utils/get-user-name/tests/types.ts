import { User } from '../../../../types';


interface MockItem {
  description : string;
  user        : User,
}

type MockResult = string;

interface Mock extends Array<MockItem | MockResult> {
  0: MockItem;
  1: MockResult;
}

export type Mocks = Array<Mock>;
