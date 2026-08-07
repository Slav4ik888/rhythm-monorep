import { Operation, OperationArguments, OperationCommand, OperationPointer } from '../../../types';



/**
 * Base Operation creator
 * TODO: check invalid data: args must contains id
 */
export const creator = (
  args    : OperationArguments,
  pointer : OperationPointer,
  command : OperationCommand,
  path    : string[] = []
): Operation => ({
  args,
  pointer,
  command,
  path
});
