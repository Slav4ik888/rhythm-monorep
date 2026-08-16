/* eslint-disable max-classes-per-file -- DTO-файл объединяет связанные схемы запросов/ответов */
// packages/backend/src/controllers/templates/dto/index.ts
// DTO запросов/ответов TemplatesController для Swagger-документации.

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TemplateDto } from '../../../dto/template.dto';

/** Тело получения шаблонов */
export class ReqGetTemplatesDto {
  @ApiProperty({ description: 'ID групп, которые нужно загрузить' })
  bunchIds: string[];
}

/** Ответ получения шаблонов */
export class ResGetTemplatesDto {
  @ApiProperty({ description: 'Шаблоны', type: [TemplateDto] })
  templates: TemplateDto[];

  @ApiProperty({
    description: 'Время последнего изменения групп (bunchId → timestamp)',
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  bunchesUpdated: Record<string, number>;
}

/** Тело обновления шаблона */
export class UpdateTemplateDto {
  @ApiProperty({ description: 'Время последнего изменения группы (timestamp)' })
  bunchUpdatedMs: number;

  @ApiProperty({ description: 'Шаблон (добавление/обновление)', type: () => TemplateDto })
  template: TemplateDto;

  @ApiProperty({ description: 'Действие с группой', enum: ['create', 'update'] })
  bunchAction: string;

  @ApiPropertyOptional({ description: 'Перезаписать шаблон целиком (есть удалённые поля)' })
  fullSet?: boolean;
}

/** Тело удаления шаблона */
export class DeleteTemplateDto {
  @ApiProperty({ description: 'Время последнего изменения группы (timestamp)' })
  bunchUpdatedMs: number;

  @ApiProperty({ description: 'ID шаблона' })
  templateId: string;

  @ApiProperty({ description: 'ID группы' })
  bunchId: string;
}
