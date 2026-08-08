import type { Operation, OperationArguments, OperationPointer } from "../../../types";
import { OperationCommand } from "../../../types";;
import { creator } from '../creator';


/**
 * Delete list of elements from DB
 *  - without delete subcollections
 */
export const createDeleteList = (
  args    : OperationArguments,
  pointer : OperationPointer,
  path    : string[] = []
): Operation => creator(
  args,
  pointer,
  OperationCommand.DELETE_LIST,
  path
);

