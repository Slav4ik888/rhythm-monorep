/* eslint-disable max-classes-per-file -- DTO-файл объединяет связанные схемы запросов/ответов */
// packages/backend/src/controllers/dashboard/dto/index.ts
// DTO запросов/ответов DashboardController для Swagger-документации.

import { ApiExtraModels, ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { ViewItemDto } from '../../../dto/view-item.dto';

/** Тело получения групп дашборда */
export class ReqGetBunchesDto {
  @ApiProperty({ description: 'ID компании' })
  companyId: string;

  @ApiProperty({ description: 'ID групп, которые нужно загрузить' })
  bunchIds: string[];

  @ApiPropertyOptional({ description: 'ID листа (для проверки доступа неавторизованных)' })
  dashboardSheetId?: string;
}

/** Ответ получения групп дашборда */
@ApiExtraModels(ViewItemDto)
export class ResGetBunchesDto {
  @ApiProperty({
    description: 'Группы элементов: bunchId → (viewItemId → ViewItem)',
    type: 'object',
    additionalProperties: { type: 'object', additionalProperties: { $ref: getSchemaPath(ViewItemDto) } },
  })
  bunches: Record<string, Record<string, ViewItemDto>>;
}

/** Тело создания элементов дашборда */
export class CreateGroupViewItemsDto {
  @ApiProperty({ description: 'Время последнего изменения группы (timestamp)' })
  bunchUpdatedMs: number;

  @ApiProperty({ description: 'ID компании' })
  companyId: string;

  @ApiProperty({ description: 'Создаваемые элементы', type: [ViewItemDto] })
  viewItems: ViewItemDto[];

  @ApiProperty({ description: 'Действие с группой', enum: ['create', 'update'] })
  bunchAction: string;
}

/** Тело обновления элементов дашборда */
export class UpdateViewItemDto {
  @ApiProperty({ description: 'Время последнего изменения группы (timestamp)' })
  bunchUpdatedMs: number;

  @ApiProperty({ description: 'ID компании' })
  companyId: string;

  @ApiProperty({ description: 'Обновляемые элементы', type: [ViewItemDto] })
  viewItems: ViewItemDto[];
}

/** Тело удаления элементов дашборда */
export class DeleteViewsDto {
  @ApiProperty({ description: 'Время последнего изменения группы (timestamp)' })
  bunchUpdatedMs: number;

  @ApiProperty({ description: 'ID компании' })
  companyId: string;

  @ApiProperty({ description: 'ID удаляемых элементов и всех вложенных', type: [ViewItemDto] })
  viewItems: ViewItemDto[];
}
