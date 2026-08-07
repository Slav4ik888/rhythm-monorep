import { DbRefName, Operation, OperationArguments } from '../../../types';
import { createUpdate } from '../../base';


export const createItemUpdate = (
  args      : OperationArguments,
  pointerId : string,
  path      : string[] = []
): Operation => createUpdate(
  args,
  {
    id        : pointerId,
    dbRefName : DbRefName.ITEMS
  },
  path
);

// {
//   path    : [],
//   command : OperationCommand.UPDATE,
//   args    : { ...updatedItem },
//   pointer : {
//     id        : document.id,
//     dbRefName : DbRefName.ITEMS
//   }
// }
