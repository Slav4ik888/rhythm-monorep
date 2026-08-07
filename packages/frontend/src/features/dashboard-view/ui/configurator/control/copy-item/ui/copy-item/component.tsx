import { FC, memo } from 'react';
import Box from '@mui/material/Box';
import { pxToRem } from 'shared/styles';
import CopyIcon from '@mui/icons-material/ContentCopy';
import { ActivatedCopiedType } from 'entities/dashboard-view';
import { AddBtn } from 'shared/ui/configurators-components';
import { blueGrey } from '@mui/material/colors';



interface Props {
  type        : ActivatedCopiedType
  selectedId  : string
  activatedId : string | undefined // Id of the activated item, нужен, чтобы вывести подсказку что сделать с выбранным элементом
  onToggle    : () => void
}

export const CopyViewItemComponent: FC<Props> = memo(({ selectedId, type, activatedId, onToggle }) => {
  const isAll = type === 'copyItemsAll';

  return (
    <Box sx={{ position: 'relative' }}>
      {
        selectedId && selectedId === activatedId
          ? <Box
              sx={(theme) => ({
                position  : 'absolute',
                top       : '100%',
                right     : 0,
                width     : pxToRem(400),
                maxWidth  : pxToRem(400),
                fontSize  : '0.8rem',
                color     : theme.palette.error.dark,
              })}
            >
            Кликните на тот элемент, в который хотите его поместить скопированный.
            Для отмены - повторно нажмите на кнопку копирования.
          </Box>
          : null
      }
      <AddBtn
        title     = {isAll ? 'All' : '1'}
        toolTitle = {`Копировать этот элемент в другой (${isAll ? 'со всеми вложенными элементами' : 'без вложений'})`}
        color     = {blueGrey[700]}
        startIcon = {CopyIcon}
        onClick   = {onToggle}
      />
    </Box>
  )
});
