import { ItemBase } from 'entities/base';
import { DefaultIconId } from 'shared/lib/icons';



export type SidebarListItemType =
  | 'collapse' // Для route | href
  | 'title'    // Заголовки
  | 'divider'  // Разделитель
  // | "examples" // Примеры
  // | "auth"     // Авторизация


export interface SidebarListItem extends ItemBase {
  // id - Key for rendering this item, он такой же как route, но нужен тк есть кнопки без route
  type        : SidebarListItemType
  title?      : string  // Текстовое название выводимое на экран
  iconId?     : DefaultIconId | null  // Код иконки из имеющихся // React.ReactNode | string
  noCollapse? : boolean // If true, don't collapse this item

  href?       : string  // Link на сторонний сайт
  route?      : string
}
