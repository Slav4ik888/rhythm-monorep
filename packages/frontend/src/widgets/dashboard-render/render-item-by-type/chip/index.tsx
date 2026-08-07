/* eslint-disable space-in-parens */
import { FC, memo, useMemo } from 'react';
import { ViewItem, ChipContainer, stylesToSx, useDashboardViewState, getKod } from 'entities/dashboard-view';
import { CONDITION_TYPE, DashboardConditionType, getConditionKod, getConditionType } from 'entities/condition-type';
import { useDashboardData } from 'entities/dashboard-data';
import { useTheme } from 'app/providers/theme';
import { StatisticPeriodType, gelStatisticPeriodLabel, gelStatisticPeriodColor } from 'entities/statistic-type';
import { useCompany } from 'entities/company';



interface Props {
  item        : ViewItem
  isTemplate? : boolean // если рендерится шаблон
}

/** Item chip */
export const ItemChip: FC<Props> = memo(({ item, isTemplate }) => {
  const theme = useTheme();
  const { paramsCustomSettings } = useCompany();
  const { activeEntities } = useDashboardData();
  const { entities } = useDashboardViewState();

  const { label, color, background } = useMemo(() => {
    const kod  = isTemplate ? '1-0-1' : getKod(entities, item);
    const type = item.settings?.chipType || '';

    let label      = 'Test label';
    let color      = '#fff';
    let background = 'red';

    if (type === 'condition') {
      const conditionKode = getConditionKod(type, kod);
      const condition = isTemplate
        ? DashboardConditionType.NORMAL
        : conditionKode
          ? getConditionType(activeEntities[conditionKode]?.data)
          : DashboardConditionType.NULL;

      label      = CONDITION_TYPE[condition].label;
      color      = theme.palette.conditionTypeChip[condition]?.color;
      background = theme.palette.conditionTypeChip[condition]?.background;
    }
    else if (type === 'period') {
      const period = isTemplate
        ? 'week'
        : kod ? activeEntities[kod]?.periodType : '' as StatisticPeriodType;

      label      = gelStatisticPeriodLabel(              period,        paramsCustomSettings);
      color      = gelStatisticPeriodColor('color',      period, theme, paramsCustomSettings);
      background = gelStatisticPeriodColor('background', period, theme, paramsCustomSettings);
    }
    else if (type === 'company') {
      const company = isTemplate
        ? 'Общая'
        : kod ? activeEntities[kod]?.companyType : '' as string;

      label      = company;
      color      = paramsCustomSettings?.companyType?.[company]?.color      || 'rgb(25, 44, 72)';
      background = paramsCustomSettings?.companyType?.[company]?.background || 'rgb(154, 206, 236)';
    }
    else if (type === 'product') {
      const product = kod ? activeEntities[kod]?.productType : '' as string;
      label      = product;
      color      = paramsCustomSettings?.productType?.[product]?.color      || 'rgb(25, 44, 72)';
      background = paramsCustomSettings?.productType?.[product]?.background || 'rgb(154, 206, 236)';
    }
    else if (type === 'custom') {
      // TODO:
    }

    return { label, color, background };
  }, [isTemplate, item, theme, activeEntities, entities, paramsCustomSettings]);


  return (
    <ChipContainer
      label     = {label}
      sx        = {{
        color,
        background,
        width  : stylesToSx(item?.styles)?.width,
        height : stylesToSx(item?.styles)?.height,
      }}
    />
  )
});
