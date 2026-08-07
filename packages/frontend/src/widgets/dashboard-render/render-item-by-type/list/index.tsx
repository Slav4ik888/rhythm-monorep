import { FC, memo, useMemo } from 'react';
import { useDashboardViewState, ViewItem, getKod } from 'entities/dashboard-view';
import { useDashboardData } from 'entities/dashboard-data';
import { getLastItem } from 'shared/helpers/arrays';
import { isStr } from 'shared/lib/validators';



interface Props {
  item        : ViewItem
  isTemplate? : boolean // если рендерится шаблон
}

/** Item List */
export const ItemList: FC<Props> = memo(({ item, isTemplate }) => {
  const { entities } = useDashboardViewState();
  const { activeEntities } = useDashboardData();

  const list = useMemo(() => {
    const kod = getKod(entities, item);
    const lastItem = getLastItem(activeEntities[kod]?.data);

    return isStr(lastItem) ? (lastItem as string).split(', ') : [lastItem];
  },
    [activeEntities, entities, item]
  );


  return (
    <>
      {
        list.map((value, index) => (
          <span key={index} style={{ marginRight: 4 }}>
            {value}
          </span>
        ))
      }
    </>
  )
});
