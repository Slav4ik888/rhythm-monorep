import { FC, memo } from 'react';
import Box from '@mui/material/Box';
import { f, pxToRem } from 'shared/styles';
import { TemplatesConfiguratorActions as Actions } from './actions';
import { UnsavedChanges } from '../../model/features/unsaved';
import {
  ViewItemTypeContainer, TemplateIdContainer, ViewItemIdContainer, SwitchToParentContainer
 } from './components';



/** Конфигуратор шаблонов */
export const TemplatesConfigurator: FC = memo(() => (
  <Box
    sx={{
      ...f('c--sb'),
      position     : 'relative',
      minWidth     : pxToRem(460),
      border       : '1px solid  #b0b0b0',
      borderRadius : pxToRem(4),
      p            : 2,
      pt           : 3
    }}
  >
    <UnsavedChanges />

    <Box sx={{ ...f('c'), height: '100%', color: 'text.main', overflowY: 'auto' }}>
      <TemplateIdContainer />
      <ViewItemIdContainer />
      <ViewItemTypeContainer />
      <SwitchToParentContainer />
    </Box>

    <Actions />
  </Box>
));
