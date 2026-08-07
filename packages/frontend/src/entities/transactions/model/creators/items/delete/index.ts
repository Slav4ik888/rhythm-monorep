import { DbRefName, Operation, OperationArguments } from '../../../types';
import { createDelete } from '../../base';


export const createItemDelete = (
  args      : OperationArguments,
  pointerId : string,
  path      : string[] = []
): Operation => createDelete(
  args,
  {
    id        : pointerId,
    dbRefName : DbRefName.ITEMS
  },
  path
);

// {
//   path    : [],
//   command : OperationCommand.DELETE,
//   args    : { id }, // itemId
//   pointer : {
//     id        : document.id,
//     dbRefName : DbRefName.ITEMS
//   }
// }
