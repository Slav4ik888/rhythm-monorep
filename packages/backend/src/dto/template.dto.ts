// packages/backend/src/dto/template.dto.ts
// DTO сущности шаблона для Swagger-документации.

import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ItemBaseDto } from './base.dto';
import { ViewItemDto } from './view-item.dto';

/** Шаблон дашборда */
@ApiExtraModels(ViewItemDto)
export class TemplateDto extends ItemBaseDto {
  @ApiProperty({
    description: 'Тип элемента',
    enum: ['box', 'text', 'divider', 'chart', 'chip', 'growthIcon', 'digitIndicator'],
  })
  type: string;

  @ApiProperty({ description: 'ID группы' })
  bunchId: string;

  @ApiProperty({
    description: 'Элементы шаблона (viewItemId → ViewItem)',
    type: 'object',
    additionalProperties: { $ref: getSchemaPath(ViewItemDto) },
  })
  viewItems: Record<string, ViewItemDto>;
}
