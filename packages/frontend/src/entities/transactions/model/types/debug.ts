/**
 * 2024-12-14
 */
export enum DebugUserAction {


  // FOLDER
  FOLDER_PANEL_ADD_BTN        = 'Folder.panel.addBtn',
  FOLDER_CHANGE_LABEL         = 'Folder.change.label',
  FOLDER_UPDATE_LABEL         = 'Folder.update.label',

  // DOCUMENT
  DOCUMENT_PANEL_ADD_BTN      = 'Document.panel.addBtn',       // Добавление Document из Panel
  DOCUMENT_UPDATE_LABEL       = 'Document.update.label',
  DOCUMENT_CLICK_ARROW_TO_WORK_SPACE_BTN = 'Document.click.arrowToWorkSpaceBtn',

  // ITEMS
  DOCUMENT_FREESPACE_ITEM_ADD = 'Document.freespace.item.add', // Добавление Item на пустое свободное пространство документа
  ITEM_PANEL_ADD_BTN          = 'Item.panel.addBtn',           // Добавление Item из Panel
  ITEM_PRESS_ENTER            = 'Item.press_enter',            // При нажатии Enter нижестоящий текст переносится в новый Item, который создаётся ниже
  ITEM_UPDATE                 = 'Item.update',
  ITEM_DELETE                 = 'Item.delete',

  UNKNOWN_TYPE                = 'Unknown DebugUserAction'
}


export interface Debug {
  userAction: DebugUserAction
}
