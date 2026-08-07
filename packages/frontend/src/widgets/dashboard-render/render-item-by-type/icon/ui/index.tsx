import { FC, memo, useMemo } from 'react';
import { RgbaString, ViewItem } from 'entities/dashboard-view';
import Icon from '@mui/material/Icon';
import { isStr } from 'shared/lib/validators';
import { getIconById } from 'shared/lib/icons';



const getIconStyle = (color: RgbaString | undefined) => ({
  width  : '100%',
  height : '100%',
  color
});


interface Props {
  item        : ViewItem
  isTemplate? : boolean // если рендерится шаблон
}

/** Item Icon */
export const ItemIcon: FC<Props> = memo(({ item, isTemplate }) => {
  const iconStyle = getIconStyle(item.styles.iconColor);

  const IconComponent = useMemo(() => getIconById(item.settings?.iconId),
    [item]
  );

  return (
    <>
      {
        isStr(IconComponent)
          ? <Icon sx={iconStyle}>{IconComponent as string}</Icon>
          : <IconComponent sx={iconStyle} />
      }
    </>
  )
});
