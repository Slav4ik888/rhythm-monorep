import { DbRefName, Operation, OperationArguments } from '../../../types';
import { createUpdate } from '../../base';


export const createDocumentUpdate = (
  args : OperationArguments & { id: string },
  path : string[] = []
): Operation => createUpdate(
  args,
  {
    id        : args.id,
    dbRefName : DbRefName.DOCUMENTS
  },
  path
);

// {
//   path    : [],
//   command : OperationCommand.UPDATE,
//   args: {
//     lastChange: creatorFixDate(userId)
//   },
//   pointer: {
//     id        : document.id,
//     dbRefName : DbRefName.DOCUMENTS
//   },
// }
