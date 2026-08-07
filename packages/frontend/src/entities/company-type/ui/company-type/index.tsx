import { FC, memo } from 'react';
import Chip from '@mui/material/Chip';
import { CustomSettings } from 'entities/company';
import { f, pxToRem, SxCard } from 'shared/styles';



const useStyle = (companyType: string, customSettings : CustomSettings, sx?: SxCard) => ({
  tooltip: {
    ...f('-c'),
    height     : pxToRem(20),
    cursor     : 'default',
  },
  chip: {
    width      : pxToRem(70),
    height     : pxToRem(15),
    fontSize   : pxToRem(12),
    cursor     : 'default',
    color      : customSettings?.companyType?.[companyType]?.color || '#999',
    background : customSettings?.companyType?.[companyType]?.background || '#eee',
    '&:hover': {
      background: customSettings?.companyType?.[companyType]?.background || '#eee',
    },
    ...sx?.root,
  }
});

interface Props {
  label?         : string
  customSettings : CustomSettings
  sx?            : SxCard
}


/**
 * Chip для статистики типа компании: Общая | Да-Телеком | Бэдком |
 */
export const CompanyTypeChip: FC<Props> = memo(({ label = '', sx: styles, customSettings }) => {
  const sx = useStyle(label, customSettings, styles);

  return (
    <Chip
      label = {label}
      size  = 'small'
      sx    = {sx.chip}
    />
  )
});
