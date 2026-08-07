import { ChangeEvent, FC, memo, MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { pxToRem } from 'shared/styles';
import { getMsFromRef } from './utils';
import { calculateStartDate, DashboardPeriodDateType, PeriodType, useDashboardData } from 'entities/dashboard-data';
import { formatDate } from 'shared/helpers/dates';
import { useCompany } from 'entities/company';
import { MDInput } from 'shared/ui/mui-design-components';



interface Props {
  type: DashboardPeriodDateType
}


export const SetPeriodDate: FC<Props> = memo(({ type: dateType }) => {
  const { paramsCompanyId: companyId } = useCompany();
  const { selectedPeriod, setSelectedPeriod } = useDashboardData();
  const ref = useRef<HTMLInputElement>(null);
  const storePeriodType = selectedPeriod?.type;
  const storeDate       = selectedPeriod?.[dateType];
  const dateStart       = dateType === 'start';
  const periodNotCustom = storePeriodType !== PeriodType.CUSTOM;


  // Устанавливаем начальные значения
  useEffect(() => {
    if (storeDate && ref.current) { // && ! ref.current?.value) {
      ref.current.value = formatDate(storeDate, 'YYYY-MM-DD');
    }
    if (dateStart && periodNotCustom) {
      const start = calculateStartDate(selectedPeriod.end, storePeriodType);

      // При монтировании, может быть не указана дата (storeSelectPeriod.end) и нельзя обнулять данные в сторадже
      // которые подтянуться чуть позже, иначе они затираются
      if (start) setSelectedPeriod({
        companyId,
        dateType,
        period: {
          start
        },
      });
    }
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [companyId, storeDate, storePeriodType, selectedPeriod.end, dateType]
  );


  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    // Validate correct date & > 01-01-1900
    if (new Date(e.target.value)?.getTime() > -2208997817000) {
      setSelectedPeriod({
        companyId,
        dateType,
        period: {
          [dateType]: getMsFromRef(ref as MutableRefObject<HTMLInputElement>)
        },
      });
    }
  },
    [companyId, dateType, setSelectedPeriod]
  );


  return (
    <MDInput
      id       = {dateStart ? 'control-date-start' : 'control-date-end'}
      // @ts-ignore
      ref      = {ref}
      variant  = 'outlined'
      type     = 'date'
      size     = 'small'
      disabled = {dateStart && periodNotCustom}
      onChange = {handleChange}
      sx       = {{
        width : pxToRem(140),
        mr    : 1
      }}
    />
  )
});
