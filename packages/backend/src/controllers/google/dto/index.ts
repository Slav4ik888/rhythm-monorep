// packages/backend/src/controllers/google/dto/index.ts
// DTO запросов/ответов GoogleController для Swagger-документации.

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Аргументы получения данных из Google Sheets */
export class GoogleGetDataDto {
  @ApiProperty({ description: 'ID компании' })
  companyId: string;

  @ApiPropertyOptional({ description: 'ID листа (для проверки доступа)' })
  dashboardSheetId?: string;
}
