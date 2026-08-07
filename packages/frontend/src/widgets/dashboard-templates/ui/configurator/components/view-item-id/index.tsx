import { FC, memo } from 'react';
import { useDashboardTemplates } from 'entities/dashboard-templates';
import Box from '@mui/material/Box';
import { f } from 'shared/styles';
import { RowWrapperTitle } from 'shared/ui/configurators-components';
import { Tooltip } from 'shared/ui/tooltip';
import { styleAtom } from '../styles';
import Typography from '@mui/material/Typography';
import { DeleteBtn } from '../../../../model/features/delete-btn';



export const ViewItemIdContainer: FC = memo(() => {
  const { selectedId, isMainItem } = useDashboardTemplates();

  return (
    <RowWrapperTitle
      boldTitle
      title     = 'Id элемента'
      toolTitle = 'Id элемента'
    >
      <Box sx={{ ...f('-c-fe'), gap: 1 }}>
        {isMainItem && <Typography sx={{ fontSize: styleAtom.fontSize }}>root</Typography>}
        <Tooltip title={selectedId}>
          <Box sx={styleAtom}>{selectedId}</Box>
        </Tooltip>
        {selectedId && <DeleteBtn type='viewItem' />}
      </Box>
    </RowWrapperTitle>
  )
});
