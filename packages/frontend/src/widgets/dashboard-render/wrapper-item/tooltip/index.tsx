import { FC, memo, ReactElement, useMemo } from 'react';
import { ViewItem, useDashboardViewState, getKod, ChipContainer as Chip } from 'entities/dashboard-view';
import { TooltipHTML } from 'shared/ui/tooltip';
import { useDashboardData } from 'entities/dashboard-data';
import { useCompany } from 'entities/company';
import { pxToRem } from 'shared/styles';
import Box from '@mui/material/Box';
import { gelStatisticPeriodColor, gelStatisticPeriodLabel } from 'entities/statistic-type';
import { useTheme } from 'app/providers/theme';



interface Props {
  item     : ViewItem
  children : ReactElement
}

export const ItemWrapperTooltip: FC<Props> = memo(({ item, children }) => {
  // console.log('___ItemWrapperTooltip');
  const theme = useTheme();
  const { paramsCustomSettings } = useCompany();
  const { startEntities } = useDashboardData();
  const { entities: entitiesView } = useDashboardViewState();
  const { kods } = useDashboardData();
  const kod = useMemo(() => getKod(entitiesView, item), [item, entitiesView]);

  const toolTitle = useMemo(() => {
    if (item.type === 'box' || item.type === 'text') return ''; // Тк в 'box' это только для настройки isGlobalKod

    const result = kods.find(it => it?.value === kod);

    return result
      ? `${result.value} ${result.title ? ` - ${result.title}` : ''}`
      : kod || '';
  }, [item, kod, kods]);


  const companyProductPeriod = useMemo(() => {
    const companyType = startEntities[kod]?.companyType;
    const productType = startEntities[kod]?.productType;
    const periodType  = startEntities[kod]?.periodType;

    const companyText = ! companyType ? '' : <span>
      <Chip
        label = {companyType}
        sx    = {{
          color      : paramsCustomSettings?.companyType?.[companyType]?.color      || 'black',
          background : paramsCustomSettings?.companyType?.[companyType]?.background || 'rgb(111, 111, 111)',
          width  : pxToRem(90),
          height : pxToRem(16),
        }}
      />
      &nbsp;
    </span>;

    const productText = !productType
      ? ''
      : <Chip
          label = {productType}
          sx    = {{
            color      : paramsCustomSettings?.productType?.[productType]?.color      || 'black',
            background : paramsCustomSettings?.productType?.[productType]?.background || 'rgb(111, 111, 111)',
            width      : pxToRem(90),
            height     : pxToRem(16),
            mr         : 1
          }}
        />;

    const periodText = ! periodType
      ? ''
      : <span>
          <Chip
            label = {gelStatisticPeriodLabel(periodType, paramsCustomSettings)}
            sx    = {{
              color      : gelStatisticPeriodColor('color',      periodType, theme, paramsCustomSettings),
              background : gelStatisticPeriodColor('background', periodType, theme, paramsCustomSettings),
              width  : pxToRem(70),
              height : pxToRem(16),
            }}
          />
          &nbsp;
        </span>;

    return <>
      {companyText}{productText}{periodText}
    </>
  },
    [paramsCustomSettings, kod, startEntities, theme]
  );


  return (
    <TooltipHTML
      title={<>
        {item.settings?.toolTitle && <Box>{item.settings.toolTitle}</Box>}
        {companyProductPeriod && <Box>{companyProductPeriod}</Box>}
        {toolTitle}
      </>}
    >
      {children}
    </TooltipHTML>
  )
});
