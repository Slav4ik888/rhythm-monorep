// packages/backend/src/controllers/params-company/dto/index.ts
// DTO запросов/ответов ParamsCompanyController для Swagger-документации.

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Аргументы получения параметров компании */
export class GetParamsCompanyDto {
  @ApiProperty({ description: 'ID компании' })
  companyId: string;

  @ApiPropertyOptional({ description: 'ID листа, к которому запрашивается доступ' })
  dashboardSheetId?: string;
}
