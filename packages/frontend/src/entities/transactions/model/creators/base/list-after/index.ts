import { Operation, OperationArguments, OperationCommand, OperationPointer } from '../../../types';
import { creator } from '../creator';


export const createListAfter = (
  args    : OperationArguments,
  pointer : OperationPointer,
  path    : string[] = []
): Operation => creator(
  args,
  pointer,
  OperationCommand.LIST_AFTER,
  path
);
