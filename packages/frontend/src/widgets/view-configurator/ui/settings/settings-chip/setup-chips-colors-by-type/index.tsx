import { FC, memo, useMemo } from 'react';
import { useDashboardData } from 'entities/dashboard-data';
import { ConfiguratorSubHeader as SubHeader } from 'shared/ui/configurators-components';
import { SetColorsItem } from './item';
import { BaseChipType } from 'entities/dashboard-view';
import { useCompany } from 'entities/company';



interface Props {
  type: BaseChipType
}

/** Настройка базовых 'periodType' | 'companyType' | 'productType' */
export const SetupChipsColorsByType: FC<Props> = memo(({ type }) => {
  const { startEntities } = useDashboardData();
  const { paramsCustomSettings, updateParamsCustomSettings } = useCompany();
  const chipValues = useMemo(() => {
    const result = new Set<string>();

    Object.values(startEntities).forEach(item => {
      if (item[type]) result.add(item[type])
    });

    return Array.from(result) || [];
  }, [type, startEntities]);


  return (
    <SubHeader title='Настройка цветов'>
      {
        chipValues.map(label => <SetColorsItem
          key      = {label}
          type     = {type}
          label    = {label}
          settings = {paramsCustomSettings}
          onSubmit = {updateParamsCustomSettings}
        />)
      }
    </SubHeader>
  )
});
