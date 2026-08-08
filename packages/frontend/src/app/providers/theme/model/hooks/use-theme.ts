import { useTheme as muiUseTheme } from '@mui/material/styles';
import type { CustomTheme } from '../../types';

export const useTheme = () => muiUseTheme() as CustomTheme
