import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { CustomTheme } from 'app/providers/theme';
import { pxToRem, rgbaFromHex } from 'shared/styles';



interface OwnerState {
  error?: boolean
  success?: boolean
  disabled?: boolean
}

export default styled(TextField)(({ theme, ownerState }: { theme: CustomTheme, ownerState: OwnerState }) => {
  const { palette } = theme;
  const { error, success, disabled } = ownerState;
  const { background: { card }, text, transparent, error: colorError, success: colorSuccess, mode } = palette;
  const isDark = mode === 'dark';

  const errorStyles = () => ({
    // eslint-disable-next-line max-len
    backgroundImage    : "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23F44335' viewBox='0 0 12 12'%3E%3Ccircle cx='6' cy='6' r='4.5'/%3E%3Cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3E%3Ccircle cx='6' cy='8.2' r='.6' fill='%23F44335' stroke='none'/%3E%3C/svg%3E\")",
    backgroundRepeat   : 'no-repeat',
    backgroundPosition : `right ${pxToRem(12)} center`,
    backgroundSize     : `${pxToRem(16)} ${pxToRem(16)}`,

    '& .Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline, &:after': {
        borderColor: colorError.main,
      },
    },

    '& .MuiInputLabel-root.Mui-focused': {
      color: colorError.main,
    },
  });


  return {
    // MuiInputBase
    '& .MuiInputBase-root': {
      background : rgbaFromHex(card, 0.8)
    },
    '& .MuiInputBase-root.Mui-disabled': {
      // '& .MuiOutlinedInput-notchedOutline': {
      //   borderColor: 'rgba(0, 0, 0, 0.38)', // цвет границы
      // },
      '& .MuiInputBase-input.Mui-disabled': {
        color: text.light,
        WebkitTextFillColor: text.light,
      },
    },
    '& .MuiInputBase-input': {
      padding  : `${pxToRem(8)} ${pxToRem(16)}`,
      fontSize : pxToRem(18),
      color    : text.main,
    },
    // MuiInputLabel
    '& .MuiInputLabel-root': {
      color: text.main
    },
    '& .MuiInputLabel-root.Mui-disabled': {
      color: text.light
    },
    // MuiOutlinedInput-input
    '& .MuiOutlinedInput-input:focus': {
      color: text.contrastText,
    },
    '& .MuiOutlinedInput-input:-webkit-autofill': {
      WebkitBoxShadow     : `0 0 0 100px ${isDark ? '#292929' : '#fff'} inset`,
      WebkitTextFillColor : text.main,
      caretColor          : text.main,
      borderRadius        : 'inherit',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: text.light // isDark ? '#4f4f4f' : '#a6a6a6' // 'text.light'
    },
    '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
      borderColor: text.light
    },
    // MuiFormHelperText
    '& .MuiFormHelperText-root': {
      color: text.main
    },

    ...(error && errorStyles()),
  }
})
