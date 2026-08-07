import { FC, memo } from 'react';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';
import Box from '@mui/material/Box';
import { f } from 'shared/styles';
import { SetBrightBtn } from './set-bright-btn';
import { CopyBtn } from 'shared/ui/buttons';



interface Props {
  selectedId: string
}

export const IdTitle: FC<Props> = memo(({ selectedId }) => (
  <RowWrapper sx={{ root: { mt: 3 } }}>
    <ConfiguratorTextTitle bold title='Id' toolTitle='Item id' />

    <Box sx={{ ...f('-c'), gap: 1 }}>
      <CopyBtn
        value     = {selectedId}
        toolTitle = 'Скопировать Id'
      />
      <SetBrightBtn selectedId={selectedId} />
    </Box>
  </RowWrapper>
));
