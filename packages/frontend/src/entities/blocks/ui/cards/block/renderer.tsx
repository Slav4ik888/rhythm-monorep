import { FC, memo } from 'react';



interface ConfigProps  {
  children  : React.ReactNode
}


interface Props  {
  component : FC<ConfigProps>
  items     : any[]
  children  : React.ReactNode
}

/**
 * TODO:
 * НАХОДИТСЯ В РАЗРАБОТКЕ - ПОКА НЕ ИСПОЛЬЗУЕТСЯ
 * Отрисовывает компонет который содержит или может содержать группу других компонентов
 */
export const DashboardItemsRenderer: FC<Props> = memo(({ component: Component, items }) => {
  if (! items || ! items.length) return null

  return (
    <Component>
      {
        ...items
      }
    </Component>
  );
});
