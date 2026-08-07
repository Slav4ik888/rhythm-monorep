import { FC, memo, SyntheticEvent } from 'react';
import MuiCheckbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { GridWrap, GridStyle } from '../../grid-wrap';
import { BoxWrap } from '../../box-wrap';
import { Tooltip } from '../../../tooltip';
import { changeGroup, UseGroup } from 'shared/lib/hooks';
import { getValueByScheme } from 'shared/helpers/objects';



const useStyles = (sx: any | undefined) => ({
  checkbox: {
    backgroundColor: '#ffffff',
    mx: 2,
    ...sx?.bg,

    '& .MuiInputBase-root': {
      backgroundColor: '#ffffff',
      ...sx?.field
    }
  }
});


interface Props {
  grid?       : GridStyle
  box?        : boolean
  sx?         : any
  sxCheckbox? : object
  group       : UseGroup<any>
  // Tooltip
  toolTitle?  : string
  // Chekbox
  label       : string
  disabled?   : boolean
  // Control
  scheme      : string
}

// v.2023-09-19
export const Checkbox: FC<Props> = memo((props) => {
  const
    { box, toolTitle, label, sx: styles, scheme, disabled, group: G } = props,
    sx = useStyles(styles),
    Wrap = box ? BoxWrap : GridWrap;


  const handleChange = (e: SyntheticEvent<Element, Event>, checked: boolean) =>
    ! disabled && changeGroup(G, [{ value: checked, scheme }]);

  // LAST
  // const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
  //   ! disabled && changeGroup(G, [{ value: e.target.checked, scheme }]);


  return (
    <Wrap {...props}>
      <Tooltip title={toolTitle || ''}>
        <FormControlLabel
          value          = 'top'
          label          = {label || ''}
          labelPlacement = 'end'
          onChange       = {handleChange}
          control        = {<MuiCheckbox
            disabled = {disabled}
            checked  = {getValueByScheme(G.group, scheme)}
            sx       = {sx.checkbox}
                            />}
        />
      </Tooltip>
    </Wrap>
  )
});
