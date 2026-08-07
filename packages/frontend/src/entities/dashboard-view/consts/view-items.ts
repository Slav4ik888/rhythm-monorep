import { ChipType, EndingType, EndingDiffType, SettingsDirection, GaugeValueType } from '../types';


export const chipOptions: Record<ChipType, { label: string; value: ChipType }> = {
  condition : { label: 'Состояние',     value: 'condition' },
  period    : { label: 'Периодичность', value: 'period' },
  company   : { label: 'Компания',      value: 'company' },
  product   : { label: 'Продукт',       value: 'product' },
  custom    : { label: 'Без привязки',  value: 'custom' },
};

export const arrayChipLabel = Object.values(chipOptions).map(item => item.label);

export const arrayEndingType: EndingType[]               = ['-',  '%',  'шт',  'руб'];
export const arrayEndingDiffType: EndingDiffType[]       = ['-',  '% соотношение',  'Разница'];
export const arraySettingsDirection: SettingsDirection[] = ['horizontal', 'vertical'];
export const arrayGaugeValueType: GaugeValueType[]       = ['integer', 'fractional'];
