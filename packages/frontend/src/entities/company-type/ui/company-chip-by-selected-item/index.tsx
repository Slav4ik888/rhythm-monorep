import { FC, memo } from 'react';
import { useDashboardViewState } from 'entities/dashboard-view';
import { pxToRem } from 'shared/styles';
import { useDashboardData } from 'entities/dashboard-data';
import { CompanyTypeChip } from '../company-type';
import { useCompany } from 'entities/company';



/** Show Company chip by kod, in Configurator by SelectedItem */
export const CompanyChipBySelectedItem: FC = memo(() => {
  const { paramsCustomSettings } = useCompany();
  const { startEntities } = useDashboardData();
  const { fromGlobalKod: kod } = useDashboardViewState();
  const companyType = startEntities[kod]?.companyType;


  return (
    <CompanyTypeChip
      label          = {companyType}
      customSettings = {paramsCustomSettings}
      sx             = {{
        root: {
          color      : paramsCustomSettings?.companyType?.[companyType]?.color || 'black',
          background : paramsCustomSettings?.companyType?.[companyType]?.background || 'rgb(111, 111, 111)',
          '&:hover': {
            background: paramsCustomSettings?.companyType?.[companyType]?.background || 'rgb(111, 111, 111)',
          },
          width      : pxToRem(90),
          height     : pxToRem(18),
          cursor     : 'default',
        }
      }}
    />
  )
});
