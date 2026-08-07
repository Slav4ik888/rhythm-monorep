import { DbRefName, Operation, OperationArguments } from '../../../types';
import { createSet } from '../../base';


export const createDocumentSet = (
  args : OperationArguments & { id: string },
  path : string[] = []
): Operation => createSet(
  args,
  {
    id        : args.id,
    dbRefName : DbRefName.DOCUMENTS
  },
  path
)

// {
//   path    : [],
//   command : OperationCommand.SET,
//   args    : { ...newItem },
//   pointer : {
//     id        : document.id,
//     dbRefName : DbRefName.DOCUMENTS
//   }
// }
