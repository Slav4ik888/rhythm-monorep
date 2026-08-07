import Box from '@mui/material/Box';
import { CustomTheme } from 'app/providers/theme';
import { ViewItemType } from 'entities/dashboard-view';
import { FC, memo } from 'react';
import { pxToRem, rgbaFromHex } from 'shared/styles';
import { ConfiguratorTextTitle, RowWrapper, getColorByType } from 'shared/ui/configurators-components';



interface Props {
  type: ViewItemType
}

export const TypeRow: FC<Props> = memo(({ type }) => (
  <RowWrapper>
    <ConfiguratorTextTitle
      bold
      title     = 'Type'
      toolTitle = 'Item type'
    />
    <Box
      component = 'span'
      sx={(theme) => ({
        color        : getColorByType(theme as CustomTheme, type),
        background   : rgbaFromHex(getColorByType(theme as CustomTheme, type), 0.1),
        fontSize     : pxToRem(12),
        border       : `1px solid ${getColorByType(theme as CustomTheme, type)}`,
        borderRadius : pxToRem(12),
        py           : pxToRem(2),
        px           : pxToRem(12),
      })}
    >
      {type}
    </Box>
  </RowWrapper>
));
