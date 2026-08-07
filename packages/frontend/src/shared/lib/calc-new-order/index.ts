import { ORDER_STEP } from 'entities/dashboard-view';
import { TowardType } from 'shared/ui/configurators-components/toward';



type Item = {
  id    : string
  order : number
}


export const calcNewOrder = (
  type          : TowardType,
  childrenItems : Item[],
  cardItem      : Item,
): number => {
  let { order } = cardItem;
  const currentIdx = childrenItems.findIndex(item => item.id === cardItem.id);

  if (currentIdx === -1) return order;

  const lastIdx = childrenItems.length - 1;

  if (type === 'up') {
    if (currentIdx === 0) { // Если первый сверху => делаем последним
      order = childrenItems[lastIdx].order + ORDER_STEP;
    }
    else if (currentIdx === 1) { // Если второй сверху => делаем первым
      order = childrenItems[0].order / 2;
    }
    else { // Если третий или ниже сверху => ставим между двумя предыдущими
      const prevOrder     = childrenItems[currentIdx - 1].order; // 2000
      const prevPrevOrder = childrenItems[currentIdx - 2].order; // 1000

      if (prevOrder === prevPrevOrder) { // Если равны => делаем между двумя предыдущими
        if (currentIdx === 1) { // Если второй равен первому => делаем первым
          order = childrenItems[0].order / 2;
        }
      }
      else {
        order = prevPrevOrder + (prevOrder - prevPrevOrder) / 2; // 1000 + (2000 - 1000) / 2 = 1500
      }
    }
  }
  // type === 'down'
  else if (currentIdx === lastIdx) { // Если последний снизу => делаем первым
    order = childrenItems[0].order / 2;
  }
  else if (currentIdx === lastIdx - 1) { // Если второй снизу => делаем последним
    order = childrenItems[lastIdx].order + ORDER_STEP;
  }
  else { // Если третий или выше снизу => ставим между двумя вышестоящими
    const nextOrder     = childrenItems[currentIdx + 1].order; // 1000
    const nextNextOrder = childrenItems[currentIdx + 2].order; // 2000
    order = nextOrder + (nextNextOrder - nextOrder) / 2; // 1000 + (2000 - 1000) / 2 = 1500
  }

  return order
}
