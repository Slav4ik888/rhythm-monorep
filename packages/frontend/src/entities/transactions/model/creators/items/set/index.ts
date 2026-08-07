import { DbRefName, Operation, OperationArguments } from '../../../types';
import { createSet } from '../../base';


export const createItemSet = (
  args      : OperationArguments,
  pointerId : string,
  path      : string[] = []
): Operation => createSet(
  args,
  {
    id        : pointerId,
    dbRefName : DbRefName.ITEMS
  },
  path
)

// {
//   path    : [],
//   command : OperationCommand.SET,
//   args    : { ...newItem },
//   pointer : {
//     id        : document.id,
//     dbRefName : DbRefName.ITEMS
//   }
// }
