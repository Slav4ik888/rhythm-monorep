
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


/** 2024-03-02 */
/* eslint-disable */
export interface OperationArgumentFormat {
  // id?         : string  // ItemId "3f8f899a-794d-4f30-b3ae-65be393c4292"
  // after?      : string  // ItemId после которого надо добавить
  // lastChange? : number  // 1708427107309
  // alive?      : boolean // Видимость объекта
  // type?       : string  // ItemType => "text" | "image" | ...
}

export type OperationArguments = OperationArgumentContent[] | any // ["Welcome to Notion", 'b'] | last_edited_time: 1708427107309
