/* eslint-disable max-classes-per-file -- DTO-файл объединяет связанные схемы */
// packages/backend/src/dto/view-item.dto.ts
// DTO элемента дашборда для Swagger-документации.

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ItemBaseDto } from './base.dto';

/** Набор данных графика */
export class ChartConfigDatasetsDto {
  @ApiPropertyOptional({ description: 'Подпись набора данных' })
  label?: string;

  @ApiProperty({ description: 'Данные (числовой массив)' })
  data: number[];

  @ApiPropertyOptional({ description: 'Натяжение линии' })
  tension?: number;

  @ApiPropertyOptional({ description: 'Радиус точки' })
  pointRadius?: number;

  @ApiPropertyOptional({ description: 'Цвет границы точки' })
  pointBorderColor?: string;

  @ApiPropertyOptional({ description: 'Цвет заливки точки' })
  pointBackgroundColor?: string;

  @ApiPropertyOptional({ description: 'Цвет линии (или массив цветов для столбцов)' })
  borderColor?: string | string[];

  @ApiPropertyOptional({ description: 'Толщина линии' })
  borderWidth?: number;

  @ApiPropertyOptional({ description: 'Цвет заливки (или массив цветов для столбцов)' })
  backgroundColor?: string | string[];

  @ApiPropertyOptional({ description: 'Заполнение области под линией' })
  fill?: boolean;

  @ApiPropertyOptional({ description: 'Максимальная толщина столбца' })
  maxBarThickness?: number;

  @ApiPropertyOptional({ description: 'Тип (для комбинированных графиков)', enum: ['line'] })
  type?: string;

  @ApiPropertyOptional({ description: 'Порядок наложения' })
  order?: number;

  @ApiPropertyOptional({ description: 'Индекс родительского графика (для тренда)' })
  parentChartsIdx?: number;
}

/** Данные трендовой линии */
export class ChartConfigTrendDatasetsDto {
  @ApiPropertyOptional({ description: 'Данные' })
  data?: number[];

  @ApiPropertyOptional({ description: 'Цвет линии' })
  borderColor?: string;

  @ApiPropertyOptional({ description: 'Толщина линии' })
  borderWidth?: number;
}

/** Настройки графика элемента */
export class ViewItemChartsDto {
  @ApiPropertyOptional({ description: 'Код показателя' })
  kod?: string;

  @ApiPropertyOptional({ description: 'Тип графика', enum: ['line', 'bar', 'pie', 'doughnut'] })
  chartType?: string;

  @ApiPropertyOptional({ description: 'Наборы данных', type: () => ChartConfigDatasetsDto })
  datasets?: ChartConfigDatasetsDto;

  @ApiPropertyOptional({ description: 'Показывать ли линию тренда' })
  isTrend?: boolean;

  @ApiPropertyOptional({ description: 'Данные тренда', type: () => ChartConfigTrendDatasetsDto })
  trendDataSets?: ChartConfigTrendDatasetsDto;
}

/** Настройки цифровых индикаторов */
export class IndicatorsConfigDto {
  @ApiPropertyOptional({ description: 'Показывать знаки + и -' })
  plusMinus?: boolean;

  @ApiPropertyOptional({ description: 'Номер значения статистики в обратном порядке (1 — последнее)' })
  valueNumber?: number;

  @ApiPropertyOptional({ description: 'Зелёный при росте / красный при падении' })
  growthColor?: boolean;

  @ApiPropertyOptional({ description: 'Убрать разряды (12 500 700 → 12.5 млн)' })
  reduce?: boolean;

  @ApiPropertyOptional({ description: 'Количество знаков после запятой' })
  fractionDigits?: number;

  @ApiPropertyOptional({ description: 'Добавлять нули после запятой' })
  addZero?: boolean;

  @ApiPropertyOptional({ description: 'Не добавлять пробел между разрядами' })
  noSpace?: boolean;

  @ApiPropertyOptional({ description: 'Окончание значения', enum: ['-', '%', 'шт', 'руб'] })
  endingType?: string;

  @ApiPropertyOptional({ description: 'Окончание разницы', enum: ['-', '% соотношение', 'Разница'] })
  endingDiffType?: string;
}

/** Настройки элемента дашборда */
export class ViewItemSettingsDto extends IndicatorsConfigDto {
  @ApiPropertyOptional({ description: 'Показывать ли элемент' })
  display?: boolean;

  @ApiPropertyOptional({ description: 'Код для одиночного элемента (Chip | GrowthItem)' })
  kod?: string;

  @ApiPropertyOptional({ description: 'Перевёрнутый график' })
  inverted?: boolean;

  @ApiPropertyOptional({ description: 'При отсутствии изменений красить чёрным' })
  unchangedBlack?: boolean;

  @ApiPropertyOptional({ description: 'Настройки графиков', type: [ViewItemChartsDto] })
  charts?: ViewItemChartsDto[];

  @ApiPropertyOptional({ description: 'Настройки графика (Chart.js)' })
  chartOptions?: object;

  @ApiPropertyOptional({ description: 'Тип чипа', enum: ['condition', 'period', 'company', 'product', 'custom'] })
  chipType?: string;

  @ApiPropertyOptional({ description: 'Изменение размера треугольника (GrowthItem)' })
  scale?: number;

  @ApiPropertyOptional({ description: 'Повернуть треугольник влево при отсутствии изменений' })
  isLeft?: boolean;
}

/** Стили элемента дашборда */
export class ViewItemStylesDto {
  @ApiPropertyOptional({ description: 'Ширина (px или %)' })
  width?: number | string;

  @ApiPropertyOptional({ description: 'Минимальная ширина' })
  minWidth?: number | string;

  @ApiPropertyOptional({ description: 'Максимальная ширина' })
  maxWidth?: number | string;

  @ApiPropertyOptional({ description: 'Высота (px или %)' })
  height?: number | string;

  @ApiPropertyOptional({ description: 'Минимальная высота' })
  minHeight?: number | string;

  @ApiPropertyOptional({ description: 'Максимальная высота' })
  maxHeight?: number | string;

  @ApiPropertyOptional({ description: 'display', enum: ['flex'] })
  display?: string;

  @ApiPropertyOptional({ description: 'Направление flex', enum: ['row', 'column', 'row-reverse', 'column-reverse'] })
  flexDirection?: string;

  @ApiPropertyOptional({ description: 'Перенос flex', enum: ['wrap', 'nowrap'] })
  flexWrap?: string;

  @ApiPropertyOptional({ description: 'Выравнивание по поперечной оси' })
  alignItems?: string;

  @ApiPropertyOptional({ description: 'Выравнивание по главной оси' })
  justifyContent?: string;

  @ApiPropertyOptional({ description: 'Отступ со всех сторон (1 = 8px)' })
  p?: number;

  @ApiPropertyOptional({ description: 'Горизонтальный отступ' })
  px?: number;

  @ApiPropertyOptional({ description: 'Вертикальный отступ' })
  py?: number;

  @ApiPropertyOptional({ description: 'Отступ сверху' })
  pt?: number;

  @ApiPropertyOptional({ description: 'Отступ справа' })
  pr?: number;

  @ApiPropertyOptional({ description: 'Отступ снизу' })
  pb?: number;

  @ApiPropertyOptional({ description: 'Отступ слева' })
  pl?: number;

  @ApiPropertyOptional({ description: 'Внешний отступ со всех сторон' })
  m?: number;

  @ApiPropertyOptional({ description: 'Горизонтальный внешний отступ' })
  mx?: number;

  @ApiPropertyOptional({ description: 'Вертикальный внешний отступ' })
  my?: number;

  @ApiPropertyOptional({ description: 'Внешний отступ сверху' })
  mt?: number;

  @ApiPropertyOptional({ description: 'Внешний отступ справа' })
  mr?: number;

  @ApiPropertyOptional({ description: 'Внешний отступ снизу' })
  mb?: number;

  @ApiPropertyOptional({ description: 'Внешний отступ слева' })
  ml?: number;

  @ApiPropertyOptional({
    description: 'Стиль границы',
    enum: ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset', 'none'],
  })
  borderStyle?: string;

  @ApiPropertyOptional({ description: 'Толщина границы' })
  borderWidth?: number | string;

  @ApiPropertyOptional({ description: 'Скругление границы' })
  borderRadius?: number | string;

  @ApiPropertyOptional({ description: 'Цвет границы' })
  borderColor?: string;

  @ApiPropertyOptional({ description: 'Тень' })
  boxShadow?: string;

  @ApiPropertyOptional({ description: 'Фон (rgba)' })
  background?: string;

  @ApiPropertyOptional({ description: 'Цвет текста (rgba)' })
  color?: string;

  @ApiPropertyOptional({ description: 'Размер шрифта (rem)' })
  fontSize?: string;
}

/** Элемент дашборда */
export class ViewItemDto extends ItemBaseDto {
  @ApiProperty({ description: 'ID элемента' })
  id: string;

  @ApiProperty({ description: 'ID группы (bunch)' })
  bunchId: string;

  @ApiProperty({ description: 'ID родителя (или "no_parentId" для корневых)' })
  parentId: string;

  @ApiProperty({ description: 'ID листа (пустая строка — основной лист)' })
  sheetId: string;

  @ApiProperty({
    description: 'Тип элемента',
    enum: ['box', 'text', 'divider', 'chart', 'chip', 'growthIcon', 'digitIndicator'],
  })
  type: string;

  @ApiProperty({ description: 'Стили', type: () => ViewItemStylesDto })
  styles: ViewItemStylesDto;

  @ApiPropertyOptional({ description: 'Настройки', type: () => ViewItemSettingsDto })
  settings?: ViewItemSettingsDto;
}
