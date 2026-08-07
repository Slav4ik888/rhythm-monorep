import { OperationArguments } from './args';


/** v.2024-04-07 */
export enum OperationCommand {


  // ADD                   = 'add', // Add new char | Item
  SET                   = 'set',
  UPDATE                = 'update',
  INSERT_CHILDREN_AFTER = 'insertChildrenAfter', // При добавлении новой страницы
  LIST_AFTER            = 'listAfter', // При добавлении пункта списка
  // LIST_REMOVE = 'listRemove',
  DELETE                = 'delete',
  DELETE_LIST           = 'deleteList',
}


export enum DbRefName {
  FOLDERS   = 'folders',
  DOCUMENTS = 'documents',
  ITEMS     = 'items'
}

export interface OperationPointer {
  id        : string    // Id главного элемента по отношению к которому выполняется действие
  dbRefName : DbRefName
}


export interface Operation {
  path    : string[]         // [] | ['properties', 'title']
  command : OperationCommand // 'add' | 'update'
  pointer : OperationPointer
  args    : OperationArguments
}
