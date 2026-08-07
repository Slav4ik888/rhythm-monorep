import { FC, memo, MouseEvent } from 'react';
import { ViewItem } from 'entities/dashboard-view';
import { InputByScheme } from '../../../base-features-components';
import { f, pxToRem } from 'shared/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CustomTheme } from 'app/providers/theme';
import { Divider } from 'shared/ui/mui-components';



interface Props {
  selectedItem: ViewItem | undefined
}

export const GaugeColumnAddParameter: FC<Props> = memo(({ selectedItem }) => (
  <>
    <Divider />
    <Box sx={{ ...f('-c-fe'), gap: 1 }}>
      <Typography
        sx={(theme) => ({
          color: (theme as CustomTheme).palette.configurator.title.textTitle,
        })}
      >
        + новый параметр
      </Typography>

      <InputByScheme
        scheme       = {`settings.gaugeColumnItems[${selectedItem?.settings?.gaugeColumnItems?.length || 0}].label`}
        width        = {pxToRem(170)}
        selectedItem = {selectedItem}
        onChange     = {(e: MouseEvent, v: string | number) => {}}
      />
    </Box>
  </>
));
