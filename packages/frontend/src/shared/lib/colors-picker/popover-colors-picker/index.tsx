import { FC, memo, useState, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import { f, pxToRem, SxCard } from 'shared/styles';
import { useClickOutside } from '../../hooks';
import { HexColorInput, RgbaColorPicker, RgbaColor  } from 'react-colorful';
import { CustomTheme, useTheme } from 'app/providers/theme';
import { hexToRgba, isValidRGBA, rgba, rgbaToHexWithAlpha } from '../utils';
import PasteIcon from '@mui/icons-material/ContentPaste';
import TransparentIcon from '@mui/icons-material/BlurOn';
import { getClipboardText } from '../../clipboard';
import { __devLog } from '../../tests/__dev-log';
import { IconButton } from 'shared/ui/mui-components';
import { CopyBtn } from 'shared/ui/buttons';
// import s from './index.module.scss';
// __devLog('MODULE STYLE: ', s);



const useStyles = (theme: CustomTheme, sx: SxCard | undefined, backgroundColor: RgbaColor | undefined) => ({
  root: {
    position: 'relative',
    ...sx?.root,
  },

  swatch: {
    width           : '50px',
    height          : '28px',
    borderRadius    : '8px',
    border          : `2px solid ${theme.palette.text.light}`,
    boxShadow       : '0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1)',
    cursor          : 'pointer',
    backgroundColor : rgba(backgroundColor),
  },

  popover: {
    position     : 'absolute',
    bottom       : sx?.popover?.bottom ? sx?.popover?.bottom : 'calc(100% + 8px)',
    right        : 0,
    ...f('c'),
    gap          : 1,
    p            : 0.5,
    pb           : 1,
    borderRadius : '9px',
    boxShadow    : '0 6px 12px rgba(0, 0, 0, 0.15)',
    background   : theme.palette.background.paper,
    zIndex       : 1000,
    ...sx?.popover,
  },
  control: {
    ...f('-c-sb'),
  },
  transparent: {
    root: {
      fontSize : pxToRem(10),
      // width    : '60px',
    }
  },
  icon: {
    color    : theme.palette.dark.main,
    fontSize : '20px',
  },
});


interface Props {
  color    : RgbaColor | undefined
  sx?      : SxCard
  onChange : (color: RgbaColor) => void
}


export const PopoverColorsPicker: FC<Props> = memo(({ sx: style, color, onChange }) => {
  const sx = useStyles(useTheme(), style, color);
  const popoverRef = useRef();
  const [isOpen, toggle] = useState(false);

  const handleOpen = useCallback(() => toggle(true), [toggle]);
  const handleClose = useCallback(() => toggle(false), [toggle]);

  useClickOutside(popoverRef, handleClose);

  const handleChange = useCallback((newColor: RgbaColor) => {
    console.log('newColor: ', newColor);
    onChange(newColor);
  },
    [onChange]
  );

  const handleChangeHex = useCallback((hex: string) => onChange(hexToRgba(hex)), [onChange]);

  const handlePasteColor = useCallback(async () => {
    const copied = await getClipboardText();
    if (isValidRGBA(copied)) handleChangeHex(copied);
  }, [handleChangeHex]);

  const handleTransparent = useCallback(() => onChange({ r: 255, g: 255, b: 255, a: 0 }), [onChange]);

  return (
    <Box sx={sx.root}>
      <Box sx={sx.swatch} onClick={handleOpen} />

      {isOpen && (
        <Box sx={sx.popover} ref={popoverRef}>
          <RgbaColorPicker
            color     = {color}
            // className = {s?.resposive}
            onChange  = {handleChange}
          />
          <Box sx={sx.control}>
            <HexColorInput
              alpha
              prefixed
              color    = {rgbaToHexWithAlpha(rgba(color))}
              style    = {{ width: 100, marginRight: 4 }}
              onChange = {handleChangeHex}
            />
            <CopyBtn
              value     = {rgbaToHexWithAlpha(rgba(color))}
              toolTitle = 'Скопировать цвет'
              sx        = {sx.icon}
            />
            <IconButton
              toolTitle = 'Вставить скопированный цвет'
              size      = 'small'
              icon      = {PasteIcon}
              sx        = {{ icon: sx.icon }}
              onClick   = {handlePasteColor}
            />
            <IconButton
              toolTitle = 'Прозрачность 100%'
              size      = 'small'
              icon      = {TransparentIcon}
              sx        = {{ icon: sx.icon }}
              onClick   = {handleTransparent}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
});
