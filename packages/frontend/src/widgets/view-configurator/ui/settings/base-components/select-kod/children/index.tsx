import { FC, memo } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ViewItem } from 'entities/dashboard-view';
import { f, pxToRem } from 'shared/styles';
import { FlagByScheme, GetFromGlobalKod } from '../../../../base-features-components';
import { StatisticPeriodChipBySelectedItem } from 'entities/statistic-type';
import { Tooltip } from 'shared/ui/tooltip';
import { FlagFromGlobalKod } from './flag-from-global-kod';
import { CompanyChipBySelectedItem } from 'entities/company-type';



interface Props {
  selectedItem : ViewItem | undefined
  disabled     : boolean
}

/** Вставка для RowSelectByField */
export const RowSelectKodChildren: FC<Props> = memo(({ selectedItem, disabled }) => (
  <>
    {
      selectedItem?.type === 'box' && <>
        <Typography sx={{ fontSize: pxToRem(12) }}>isGlobalKod</Typography>
        <FlagByScheme
          scheme       = 'settings.isGlobalKod'
          title        = 'isGlobalKod'
          // eslint-disable-next-line max-len
          toolTitle    = 'Если true, то это kod, будет автоматически подтягиваться всем children у которых стоит галка (fromGlobalKod)'
          sx           = {{ root: { my: 2 } }}
        />
      </>
    }
    {
      (selectedItem?.type === 'chip'
        || selectedItem?.type === 'digitIndicator'
        || selectedItem?.type === 'gaugeColumn'
        || selectedItem?.type === 'growthIcon'
        || selectedItem?.type === 'list') && (<Box sx={{ ...f('-c'), gap: 2, my: 2 }}>
        <FlagFromGlobalKod scheme='settings.fromGlobalKod' />
        <CompanyChipBySelectedItem />
        <StatisticPeriodChipBySelectedItem />
        {
          disabled && <Tooltip title={disabled ? 'Чтобы выбрать другой код, снимите галку с "fromGlobalKod".' : ''}>
            <GetFromGlobalKod type={selectedItem?.settings?.chipType} />
          </Tooltip>
        }
      </Box>)
    }
  </>
));
