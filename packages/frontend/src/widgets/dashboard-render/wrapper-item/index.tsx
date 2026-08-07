import { FC, memo, ReactNode, useCallback, useMemo } from 'react';
import {
  ViewItem, ViewItemId, stylesToSx, useDashboardViewState, DashboardViewEntities, isFirstGlobalKodInBranch,
  ActivatedCopied
 } from 'entities/dashboard-view';
import Box from '@mui/material/Box';
import { ItemWrapperTooltip } from './tooltip';
import { blue, orange } from '@mui/material/colors';



const getStyles = (
  item                : ViewItem, // Отрисовываемый элемент на Дашборде
  editMode            : boolean,
  entities            : DashboardViewEntities,
  selectedItem        : ViewItem,
  activatedCopied     : ActivatedCopied | undefined,
  activatedMovementId : string,
) => {
  const root: any = {
    position   : 'relative',
    cursor     : 'default',
    fontFamily : 'Montserrat-Regular',
    ...stylesToSx(item?.styles),
  };

  const absolute: any = {
    position : 'absolute',
    top      : '-1px',
    bottom   : '-1px',
    left     : '-1px',
    right    : '-1px',
  };

  // Подсветка выбранного элемента
  const bright: any = {
    ...absolute,
    boxShadow  : '0px 0px 8px 8px rgb(229 12 12)',
    transition : 'box-shadow 0.5s ease-in-out', /* Плавное изменение тени */
    zIndex     : 2000,
  };


  const hover = {
    ...absolute,
    zIndex: 1000,
  };

  if (editMode) {
    const colorHover = activatedCopied
      ? blue[700]
      : activatedMovementId
        ? orange[700]
        : 'rgb(62 255 10)';

    hover['&:hover'] = {
      border: `3px solid ${colorHover}`
    };
    // Рамку вокруг Box с isGlobalKod если у текущего выбрано fromGlobalKod
    if (isFirstGlobalKodInBranch(entities, selectedItem?.id, item.id)
      && (selectedItem.settings?.fromGlobalKod || selectedItem.settings?.charts?.filter(it => it.fromGlobalKod)?.length)
    ) {
      hover.border = '2px solid #f31a64';
    }
  }

  return {
    root, hover, bright
  }
};


interface Props {
  item     : ViewItem
  children : ReactNode
  onSelect : (id: ViewItemId) => void
}

/** Item wrapper */
export const ItemWrapper: FC<Props> = memo(({ item, children, onSelect }) => {
  // console.log('___ItemWrapper');
  const { editMode, selectedItem, entities, bright, activatedCopied, activatedMovementId } = useDashboardViewState();

  const sx = useMemo(() => getStyles(item, editMode, entities, selectedItem, activatedCopied, activatedMovementId),
    [item, editMode, entities, selectedItem, activatedCopied, activatedMovementId]
  );

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    onSelect(item.id);
  },
    [item.id, onSelect]
  );

  const component = (<Box
    id      = {item.id}
    sx      = {sx.root}
    onClick = {handleClick}
  >
    {
      editMode && <Box sx={sx.hover} />
    }
    {
      editMode && bright && item?.id === selectedItem?.id && <Box sx={sx.bright} />
    }
    {
      children
    }
  </Box>);

  if (['box', 'chart', 'period'].includes(item.type)
    || (item.type === 'text' && ! item.settings?.toolTitle) // If no toolTitle, don`t show
  ) return component;


  return (
    <ItemWrapperTooltip item={item}>
      {component}
    </ItemWrapperTooltip>
  )
});
