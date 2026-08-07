import { FC, memo } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useStyles } from './styles';



type Props = {
  label : string
  sx?   : any
}

/**
 * v.2024-02-08
 */
export const Label: FC<Props> = memo(({ sx: styles, label }) => {
  const sx = useStyles(styles, label.length);


  if (! label) return null

  return (
    <>
      <Box sx={{ ...sx.hiddenLabelBG }} />
      <Typography sx={{ ...sx.label }}>{label}</Typography>
    </>
  )
});
