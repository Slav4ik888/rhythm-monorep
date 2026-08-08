import type { Operation, OperationArguments, OperationPointer } from '../../../types';
import { OperationCommand } from '../../../types';
import { creator } from '../creator';

export const createUpdate = (args: OperationArguments, pointer: OperationPointer, path: string[] = []): Operation =>
  creator(args, pointer, OperationCommand.UPDATE, path);
