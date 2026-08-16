/* eslint-disable max-classes-per-file -- DTO-файл объединяет связанные схемы запросов/ответов */
// packages/backend/src/controllers/company/dto/index.ts
// DTO запросов/ответов CompanyController для Swagger-документации.

import { ApiProperty } from '@nestjs/swagger';
import { CompanyDto } from '../../../dto/company.dto';

/** Тело обновления данных компании */
export class UpdateCompanyDto {
  @ApiProperty({ description: 'Данные компании для обновления', type: () => CompanyDto })
  companyData: CompanyDto;
}

/** Тело удаления листа компании */
export class DeleteSheetDto {
  @ApiProperty({ description: 'ID компании' })
  companyId: string;

  @ApiProperty({ description: 'ID удаляемого листа' })
  sheetId: string;
}
