import { AccessLevel } from '../types';


/** Приоритет уровней */
export const ACCESS_PRIORITY: Record<AccessLevel, number> = {
  'n': 0,    // 'none'              - нет доступа
  'v': 10,   // 'view'              - просмотр c авториизацией
  'e': 20,   // 'edit'              - права на редактирование
};


interface ConstAccessType {
  label: string
}

export const ACCESS_TYPE: Record<AccessLevel, ConstAccessType> = {
  'n': {
    label: 'Закрыт'
  },
  'v': {
    label: 'Просмотр'
  },
  'e': {
    label: 'Редактирование'
  },
};

export const ACCESS_LABELS = Object.values(ACCESS_TYPE).map(item => item.label);

export const ACCESS_LABEL_TYPE: Record<string, AccessLevel> = {
  [ACCESS_TYPE.n.label]   : 'n',
  [ACCESS_TYPE.v.label]   : 'v',
  [ACCESS_TYPE.e.label]   : 'e',
};
