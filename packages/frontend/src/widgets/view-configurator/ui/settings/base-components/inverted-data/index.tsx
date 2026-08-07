import { FC, memo } from 'react';
import Typography from '@mui/material/Typography';
import { ViewItemType } from 'entities/dashboard-view';
import { RowFlagByScheme, FlagByScheme } from '../../../base-features-components';
import { f, pxToRem } from 'shared/styles';
import Box from '@mui/material/Box';



interface Props {
  type?  : ViewItemType
  index? : number // For charts
}

/**
 * График перевёрнутый или нет. Пример - если задолженность уменьшается то это рост
 */
export const InvertedData: FC<Props> = memo(({ index, type }) => (
  <>
    {
      type === 'box' && <Box sx={{ ...f('-c-fe'), mr: pxToRem(80) }}>
        <Typography sx={{ fontSize: pxToRem(12) }}>globalInverted</Typography>
        <FlagByScheme
          scheme       = 'settings.globalInverted'
          title        = 'globalInverted'
          // eslint-disable-next-line max-len
          toolTitle    = 'Если true, то всем children, у которых где стоит галка (fromGlobalInverted), примениться inverted = true'
        />
      </Box>
    }
    {
      (type === 'digitIndicator'
        || type === 'growthIcon') && (
        <RowFlagByScheme
          scheme       = 'settings.inverted'
          title        = 'Inverted'
          toolTitle    = 'Перевёрнутый график или нет. Пример - если задолженность уменьшается то это рост'
          sx           = {{ mt: 2 }}
        />
      )
    }
    {
      type === 'chart' && (
        <RowFlagByScheme
          scheme       = {`settings.charts.[${index}].inverted`}
          title        = 'Inverted'
          toolTitle    = 'Перевёрнутый график или нет. Пример - если задолженность уменьшается то это рост'
          sx           = {{ mt: 2 }}
        />
      )
    }
  </>
));
