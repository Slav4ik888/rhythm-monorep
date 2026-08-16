/* eslint-disable max-classes-per-file -- DTO-файл объединяет связанные схемы */
// packages/backend/src/dto/base.dto.ts
// Общие DTO для Swagger-документации: базовые поля сущностей.

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Фиксация даты и автора события */
export class FixDateDto {
  @ApiProperty({ description: 'ID пользователя, создавшего или изменившего запись' })
  userId: string;

  @ApiProperty({ description: 'Дата события (timestamp)' })
  date: number;
}

/** Базовые поля сущностей проекта (id, condition, createdAt и т.д.) */
export class ItemBaseDto {
  @ApiProperty({ description: 'Уникальный идентификатор' })
  id: string;

  @ApiPropertyOptional({ description: 'Состояние', enum: ['draft', 'active', 'disabled', 'suspended', 'deleted'] })
  condition?: string;

  @ApiPropertyOptional({ description: 'ID родительского элемента' })
  parentId?: string;

  @ApiPropertyOptional({ description: 'Заголовок' })
  label?: string;

  @ApiPropertyOptional({ description: 'Описание' })
  description?: string;

  @ApiPropertyOptional({ description: 'Комментарий' })
  comment?: string;

  @ApiPropertyOptional({ description: 'Порядок сортировки среди элементов одного уровня' })
  order?: number;

  @ApiPropertyOptional({ description: 'Видимый или невидимый (удалённый) элемент' })
  display?: boolean;

  @ApiProperty({ description: 'Дата создания', type: () => FixDateDto })
  createdAt: FixDateDto;

  @ApiProperty({ description: 'Дата последнего изменения', type: () => FixDateDto })
  lastChange: FixDateDto;
}
