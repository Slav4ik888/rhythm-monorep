import { Operation, OperationArguments, OperationCommand, OperationPointer } from '../../../types';
import { creator } from '../creator';


/**
 * Delete one element from DB
 */
export const createDelete = (
  args    : OperationArguments,
  pointer : OperationPointer,
  path    : string[] = []
): Operation => creator(
  args,
  pointer,
  OperationCommand.DELETE,
  path
);

