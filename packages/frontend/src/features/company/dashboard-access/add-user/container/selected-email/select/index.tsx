import { FC, useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AccessLevel, ACCESS_LABELS, ACCESS_LABEL_TYPE, ACCESS_TYPE, CompanyDashboardMember } from 'entities/company';
import { isNotEmail } from 'shared/lib/validators';
import { pxToRem } from 'shared/styles';



interface Props {
  selectedEmail       : string
  selectedAccessLevel : AccessLevel
  existingEmail       : CompanyDashboardMember | undefined // Выбранный емэйл уже есть в списке
  onSetAccessLevel    : (accessLevel: AccessLevel) => void
}


export const SelectValue: FC<Props> = ({
  selectedEmail, selectedAccessLevel, existingEmail, onSetAccessLevel
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<AccessLevel>(selectedAccessLevel);
  const [labels, setLabels] = useState<string[]>(ACCESS_LABELS.slice(1));


  useEffect(() => {
    if (existingEmail) {
      setValue(existingEmail.a?.f as AccessLevel);
      setLabels(ACCESS_LABELS); // Убрать 'none'
    }
    else {
      setValue('v');
      setLabels(ACCESS_LABELS.slice(1));
    }
  }, [selectedEmail, existingEmail]);


  useEffect(() => {
    setValue(selectedAccessLevel);
  }, [selectedAccessLevel]);
  const handleChange = (event: SelectChangeEvent<string>) => {
    onSetAccessLevel(ACCESS_LABEL_TYPE[event.target.value]);
  };

  const handleClose = () => setOpen(false);

  const handleOpen = () => setOpen(true);


  return (
    <FormControl sx={{ width: pxToRem(120), minWidth: pxToRem(120) }}>
      <Select
        open     = {open}
        onClose  = {handleClose}
        onOpen   = {handleOpen}
        disabled = {isNotEmail(selectedEmail)}
        value    = {ACCESS_TYPE[value].label}
        sx       = {{ height: pxToRem(44) }}
        onChange = {handleChange}
      >
        {
          labels.map((label, index) => (
            <MenuItem key={index} value={label}>
              {label}
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
}
