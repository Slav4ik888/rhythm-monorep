import { FC, memo } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Tooltip } from 'shared/ui/tooltip';
import { f, pxToRem } from 'shared/styles';
import { StatisticPeriodTypeChip } from 'entities/statistic-type';
import { useDashboardData } from 'entities/dashboard-data';
import { CompanyTypeChip } from 'entities/company-type';
import { useCompany } from 'entities/company';



const sxChip = {
  width: pxToRem(70),
  maxWidth: pxToRem(70),
  height: pxToRem(15),
};

interface Props {
  item?: {
    value? : string
    title? : string
  }
}

/** Item вместо стандартного li для списка */
export const SelectKodItem: FC<Props> = memo(({ item }) => {
  const { paramsCustomSettings } = useCompany();
  const { itemByKod } = useDashboardData({ kod: item?.value });

  return (
    <Tooltip title={item?.title}>
      <Box sx={{ ...f('-c'), gap: 1 }}>
        <Typography
          sx={{
            width    : pxToRem(100),
            maxWidth : pxToRem(100),
          }}
        >
          {item?.value}
        </Typography>

        <CompanyTypeChip
          label          = {itemByKod?.companyType}
          customSettings = {paramsCustomSettings}
          sx             = {{ root: sxChip }}
        />
        <StatisticPeriodTypeChip
          type = {itemByKod?.periodType}
          sx   = {{ root: sxChip }}
        />
        <Typography sx={{ maxWidth: pxToRem(300) }}>
          {item?.title}
        </Typography>
      </Box>
    </Tooltip>
  )
});
