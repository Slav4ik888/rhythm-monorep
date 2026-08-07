import { FC, memo, useEffect, useRef, useState } from 'react';
import { PopoverColorsPicker } from './popover-colors-picker';
import { useDebouncyEffect } from 'use-debouncy';
import { RgbaString } from 'entities/dashboard-view';
import { rgba, rgbaStringToRgba } from './utils';
import { SxCard } from 'shared/styles';
import { RgbaColor } from 'react-colorful';
import { isNotUndefined } from '../validators';
import { __devLog } from '../tests/__dev-log';



interface Props {
  defaultColor : RgbaString | undefined
  sx?          : SxCard
  onChange     : (color: RgbaString) => void
}


export const ColorPicker: FC<Props> = memo(({ sx, defaultColor, onChange }) => {
  // TODO: найти ошибку - когда отсутствует цвет в новом SelectItem то в него подтягивается из предыдущего (откуда перешли)
  const [color, setColor] = useState<RgbaColor | undefined>();
  // Для того, чтобы при переключении между элементами, в выбранны не подтягивался цвет предыдущего
  // для этого храним предыдущее значение defaultColor
  const prevDefaultColorRef = useRef(defaultColor);
  const [isChanges, setIsChanges] = useState(false); // Было ли хотя бы 1 изменение


  useEffect(() => {
    // Условие для того, чтобы попробовать устранить баг, когда при первоначальной монтировке выбранного элемента
    // defaultColor приходит undefined и из rgbaStringToRgba подставляется rgba(undefined, undefined, undefined...)
    if (defaultColor) setColor(rgbaStringToRgba(defaultColor));
  }, [defaultColor]);


  useDebouncyEffect(() => {
    // Не обновлять значение, если в компоненте оно ещё не существует (например, его ещё ни сразу не устанавливали)
    if (defaultColor === undefined && color === undefined) return;

    // Не обновлять значение, при первоначальной установке color
    if (rgba(color) === defaultColor && ! isChanges) return; // Вроде устранил с помощью isChanges - баг в том, что если изменили defaultColor, то вернуть его же система не даст

    // Если defaultColor изменился, обновляем color
    if (prevDefaultColorRef.current !== defaultColor) {
      prevDefaultColorRef.current = defaultColor; // Обновляем предыдущее значение
    }
    else if (rgba(color) !== defaultColor) {
        if (isNotUndefined(color?.r)) {
          setIsChanges(true);
          onChange(rgba(color));
        }
        else __devLog('ColorPicker', 'ПОПЫТКА СОХРАНИТЬ UNDEFINED');
      }
  }, 20, [isChanges, prevDefaultColorRef.current, defaultColor, color, onChange]);


  return <PopoverColorsPicker sx={sx} color={color} onChange={setColor} />;
});
