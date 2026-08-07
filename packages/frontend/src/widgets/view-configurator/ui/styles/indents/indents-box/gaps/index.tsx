import { FC, memo } from 'react';
import Box from '@mui/material/Box';
import { f, pxToRem } from 'shared/styles';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';
import { ViewItem } from 'entities/dashboard-view';
import { InputByScheme } from '../../../../base-features-components';



interface Props {
  selectedItem : ViewItem | undefined
}

/** gaps style */
export const GapsRow: FC<Props> = memo(({ selectedItem }) => (
  <RowWrapper>
    <ConfiguratorTextTitle title='Gaps' toolTitle='gaps' bold />

    <Box sx={{ ...f('-c-fe'), gap: pxToRem(8) }}>
      gap
      <InputByScheme
        type         = 'number'
        scheme       = 'styles.gap'
        toolTitle    = 'Универсальный отступ - единое значение для row-gap и column-gap'
        width        = '2rem'
        selectedItem = {selectedItem}
        onChange     = {() => {}}
      />
      row-gap
      <InputByScheme
        type         = 'number'
        scheme       = 'styles.rowGap'
        toolTitle    = 'Вертикальный отступ (между строками)'
        width        = '2rem'
        selectedItem = {selectedItem}
        onChange     = {() => {}}
      />
      column-gap
      <InputByScheme
        type         = 'number'
        scheme       = 'styles.columnGap'
        toolTitle    = 'Горизонтальный отступ (между колонками)'
        width        = '2rem'
        selectedItem = {selectedItem}
        onChange     = {() => {}}
      />
    </Box>
  </RowWrapper>
));
