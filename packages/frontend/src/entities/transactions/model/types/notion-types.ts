
export enum UserAction {
  'Text.handleMutation', // Add new chars
  'Text.handleEnter', // Нажали Enter => создалась ниже новая строка
  'textAnnotationActions.annotateSelection', // Выделил текст и сделал жирным
  'SlashMenu.handleAccept', // Во всплывающем меню выбрал создать Text item
  'textBackspaceActions.textBackspaceWithinContent', // Backspace
  'revisionActions.performUndoRedoRevisionTransaction', // Ctrl+Z
  'ListItemBlock.handleDrop',
  'SelectableContainer.click', // Click на пустой странице и появился Item
  'OutlinerItem.createdPage', // В меню нажал кнопку создать страничку
}

export interface Debug {
  userAction: UserAction
}


export enum OperationCommand {
  SET         = 'set', // Add new char
  UPDATE      = 'update',
  LIST_AFTER  = 'listAfter', // При добавлении пункта списка
  LIST_REMOVE = 'listRemove'
}


export interface OperationPointer {
  id      : string // ItemId 'c43adae0-c0ea-4463-a5b7-c4f34cb0b325'
  spaceId : string // companyId '15a38f39-5a59-480f-8bda-9ee5abad20cc'
  table   : string // 'block'
}

// ARGUMENTS

export enum OperationArgumentFormatType {
  BOLD       = 'b',
  UNDERLINE  = 'u',
  ITALIC     = 'i',
  LINK       = 'a',
  COLOR      = 'c',
  BACKGROUND = 'bg'
}

// BACKGROUND
// ['bg', '#213492']

// COLOR
// ['c', '#213492']

// LINK
// ['a', , 'https://www.thm.su']

export interface OperationArgumentContentStyleItem extends Array<OperationArgumentFormatType | string> {
  0: OperationArgumentFormatType
  1: string
}

export type OperationArgumentContentStyles = OperationArgumentContentStyleItem[]


export interface OperationArgumentContent extends Array<string | OperationArgumentContentStyles> {
  0: string
  1: OperationArgumentContentStyles
}

export interface OperationArgumentFormat {
  id?               : string  // ItemId "3f8f899a-794d-4f30-b3ae-65be393c4292"
  after?            : string  // ItemId после которого надо добавить
  last_edited_time? : number  // 1708427107309
  alive?            : boolean // Видимость объекта
  type?             : string  // ItemType => "text" | "image" | ...
  space_id?         : string  // "15a38f39-5a59-480f-8bda-9ee5abad20cc"
  parent_id?        : string
  parent_table?     : string  // "block"
  version?          : number  // Don`t now
}

export type OperationArgument = OperationArgumentContent | OperationArgumentFormat // ["Welcome to Notion", 'b'] | last_edited_time: 1708427107309


// OPERATION

export interface Operation {
  path    : string[]         // [] | ['properties', 'title']
  command : OperationCommand // 'set' | 'update'
  pointer : OperationPointer
  args    : OperationArgument[]
}


export interface Transaction {
  id         : string // '2d7193b6-3459-4a39-9ee0-009edb9da731'
  spaceId    : string // '15a38f39-5a59-480f-8bda-9ee5abad20cc'
  debug      : Debug
  operations : Operation[]
}


export interface Req {
  requestId    : string // '1fca0eb8-b85e-4585-8cd3-660e794d4aaf'
  transactions : Transaction[]
}



// DEMO

const demo: Req = {
  requestId    : '1fca0eb8-b85e-4585-8cd3-660e794d4aaf',
  transactions : [
    {
      id         : '2d7193b6-3459-4a39-9ee0-009edb9da731',
      spaceId    : '15a38f39-5a59-480f-8bda-9ee5abad20cc',
      debug      : {
        userAction: UserAction['Text.handleMutation']
      },
      operations : [
        {
          path    : ['properties', 'title'], // => properties.title
          command : OperationCommand.SET,
          pointer : {
            id      : 'c43adae0-c0ea-4463-a5b7-c4f34cb0b325',
            spaceId : '15a38f39-5a59-480f-8bda-9ee5abad20cc',
            table   : 'block'
          },
          args: [
            ['Hello ', []],
            ['my ', [ // ["b"], ["u"], ["i"], ["bg", "blue"]
              [OperationArgumentFormatType.BOLD, ''],
              [OperationArgumentFormatType.UNDERLINE, ''],
              [OperationArgumentFormatType.ITALIC, ''],
              [OperationArgumentFormatType.BACKGROUND, 'blue']
              ]
            ],
            ['friend!!!', [[OperationArgumentFormatType.LINK, 'https://www.thm.su'],
            [OperationArgumentFormatType.BACKGROUND, 'orange']]]
          ]
        }
      ]
    }
  ]
}


// spellcheck=true contenteditable=true

// id: "a641ccfe-0165-45ed-9f15-96023ab9598e"

// id: "3f8f899a-794d-4f30-b3ae-65be393c4292"
// parent_id: "a641ccfe-0165-45ed-9f15-96023ab9598e"

// id: "011a97f1-e72c-4d21-a3a5-a618df4d8dd7"

// Перемещение Item_2
// 1 - Убираем видимость этого Item_2
// 2 - listRemove Item_2 from parent_id [from 'content'] (у того куда Item_2 был вложен)
// 3 - Возвращае видимость этого Item_2 + указываем заново parent_id и parent_table в который переместили
// 4 - В parent_id в 'content' перемещ Item_2 (arg: { id: Item_2_Id, after: item_id })
// 5 - Item_2 last_edited_time
// 5 - parent_id last_edited_time
