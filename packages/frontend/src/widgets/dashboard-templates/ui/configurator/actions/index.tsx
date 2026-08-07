import { FC, memo } from 'react';
import { f } from 'shared/styles';
import Box from '@mui/material/Box';
import { TemplatesClearLsBunchesUpdated } from './clear-ls-buches-updated';
import { AddToDashboardBtn } from '../../../model/features';



/** Конфигуратор шаблонов */
export const TemplatesConfiguratorActions: FC = memo(() => (
  <Box sx={{ ...f('c'), gap: 2, mt: 2 }}>
    <Box sx={{ ...f('--fe'), gap: 2, mb: 1 }}>
      <TemplatesClearLsBunchesUpdated />
    </Box>

    <Box sx={{ ...f('--fe'), gap: 2, mb: 1 }}>
      <AddToDashboardBtn type='copyItemFirstOnly' />
      <AddToDashboardBtn type='copyItemsAll' />
    </Box>
  </Box>
));
