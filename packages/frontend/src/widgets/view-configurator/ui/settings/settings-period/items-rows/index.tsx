import { FC, memo } from 'react';
import { useDashboardViewState } from 'entities/dashboard-view';
import { FlagByScheme, InputByScheme } from '../../../base-features-components';
import { INDIVIDUAL_PERIOD } from 'entities/charts';
import { RowWrapperTitle } from 'shared/ui/configurators-components';
import Box from '@mui/material/Box';
import { f, pxToRem } from 'shared/styles';



export const ItemsRows: FC = memo(() => {
  const { selectedItem } = useDashboardViewState();

  return (
    <>
      {
        Object.entries(INDIVIDUAL_PERIOD).map(([keyValue, value]) => (
          <RowWrapperTitle
            boldTitle
            title     = {value}
            toolTitle = {value}
            key       = {keyValue}
          >
            <Box sx={f('-c')}>
              <FlagByScheme
                scheme       = {`settings.periods.${keyValue}.disabled`}
                title        = {keyValue}
                toolTitle    = 'Показать/скрыть этот пункт'
              />

              <InputByScheme
                scheme       = {`settings.periods.${keyValue}.title`}
                width        = {pxToRem(140)}
                selectedItem = {selectedItem}
                // sx           = {sx}
                onChange     = {() => {}}
              />
            </Box>
          </RowWrapperTitle>
        ))
      }
    </>
  )
});
