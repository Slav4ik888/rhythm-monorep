import { DbRefName, Operation, OperationArguments } from '../../../types';
import { createDeleteList } from '../../base';


export const createItemDeleteList = (
  args      : OperationArguments,
  pointerId : string,
  path      : string[] = []
): Operation => createDeleteList(
  args,
  {
    id        : pointerId,
    dbRefName : DbRefName.ITEMS
  },
  path
);

// {
//   path    : [],
//   command : OperationCommand.DELETE_LIST,
//   args    : { ids }, // string[] - itemIds
//   pointer : {
//     id        : document.id,
//     dbRefName : DbRefName.ITEMS
//   }
// }
