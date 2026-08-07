import { Operation, OperationArguments, OperationCommand, OperationPointer } from '../../../types';
import { creator } from '../creator';


export const createSet = (
  args    : OperationArguments,
  pointer : OperationPointer,
  path    : string[] = []
): Operation => creator(
  args,
  pointer,
  OperationCommand.SET,
  path
);

