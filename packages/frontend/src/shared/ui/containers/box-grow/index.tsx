import { FC } from 'react';
import Box from '@mui/material/Box';


export const BoxGrow: FC = () => <Box
  component = 'span'
  sx        = {{ flexGrow: 1 }}
/>
