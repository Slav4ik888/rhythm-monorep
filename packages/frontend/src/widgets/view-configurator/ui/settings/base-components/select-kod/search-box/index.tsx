import { FC, memo, useCallback } from 'react';
import Box from '@mui/material/Box';
import { f } from 'shared/styles';
import { Input } from 'shared/ui/containers';



interface Props {
  onSearch: (value: string) => void
}

/** SearchBox для поиска внутри списка Kods */
export const SelectKodItemSearchBox: FC<Props> = memo(({ onSearch }) => {
  const onChange = useCallback((e: any) => onSearch(e.target.value), [onSearch]);

  return (
    <Box
      sx={{
        ...f(),
        width : '100%',
        p     :1,
      }}
    >
      <Input
        fullWidth
        autoFocus
        label    = 'Поиск'
        onChange = {onChange}
      />
    </Box>
  )
});
