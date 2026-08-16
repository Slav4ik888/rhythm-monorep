/* eslint-disable max-classes-per-file -- DTO-файл объединяет связанные схемы */
// packages/backend/src/dto/company.dto.ts
// DTO сущности компании для Swagger-документации.

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FixDateDto } from './base.dto';

/** Настройка цвета/фона */
export class ColorSettingsDto {
  @ApiPropertyOptional({ description: 'Название (например, период: "Мес"/"Нед")' })
  title?: string;

  @ApiPropertyOptional({ description: 'Цвет' })
  color?: string;

  @ApiPropertyOptional({ description: 'Фон' })
  background?: string;
}

/** Пользовательские настройки отображения */
export class CustomSettingsDto {
  @ApiPropertyOptional({
    description: 'Настройки по типу периода (ключ → настройки цвета)',
    type: 'object',
    additionalProperties: { type: 'object' },
  })
  periodType?: Record<string, ColorSettingsDto>;

  @ApiPropertyOptional({
    description: 'Настройки по типу компании',
    type: 'object',
    additionalProperties: { type: 'object' },
  })
  companyType?: Record<string, ColorSettingsDto>;

  @ApiPropertyOptional({
    description: 'Настройки по типу продукта',
    type: 'object',
    additionalProperties: { type: 'object' },
  })
  productType?: Record<string, ColorSettingsDto>;
}

/** Данные Google-таблицы */
export class GoogleDataDto {
  @ApiProperty({ description: 'URL Google-таблицы (Apps Script)' })
  url: string;
}

/** Права к профилю компании */
export class CompanyProfileAccessDto {
  @ApiPropertyOptional({ description: 'Полный доступ', enum: ['n', 'v', 'e'] })
  f?: string;
}

/** Участник с правами к профилю компании */
export class CompanyProfileMemberDto {
  @ApiProperty({ description: 'Email участника' })
  e: string;

  @ApiProperty({ description: 'Права к профилю компании', type: () => CompanyProfileAccessDto })
  a: CompanyProfileAccessDto;
}

/** Права к дашборду компании */
export class CompanyDashboardAccessDto {
  @ApiProperty({ description: 'Полный доступ', enum: ['n', 'v', 'e'] })
  f: string;
}

/** Участник с правами к дашборду компании */
export class CompanyDashboardMemberDto {
  @ApiProperty({ description: 'Email участника' })
  e: string;

  @ApiProperty({ description: 'Права к дашборду компании', type: () => CompanyDashboardAccessDto })
  a: CompanyDashboardAccessDto;
}

/** Компания (организация) */
export class CompanyDto {
  @ApiProperty({ description: 'ID компании' })
  id: string;

  @ApiProperty({ description: 'Название компании' })
  companyName: string;

  @ApiProperty({ description: 'ID владельца' })
  ownerId: string;

  @ApiProperty({ description: 'Email владельца' })
  owner: string;

  @ApiProperty({ description: 'URL логотипа' })
  logoUrl: string;

  @ApiProperty({ description: 'Статус компании', enum: ['NEW', 'VERIFIED', 'ACTIVE', 'REMOVED'] })
  status: string;

  @ApiProperty({ description: 'Участники с правами к профилю', type: [CompanyProfileMemberDto] })
  companyMembers: CompanyProfileMemberDto[];

  @ApiProperty({ description: 'Дата создания', type: () => FixDateDto })
  createdAt: FixDateDto;

  @ApiProperty({ description: 'Дата последнего изменения', type: () => FixDateDto })
  lastChange: FixDateDto;

  @ApiProperty({ description: 'Данные Google-таблицы', type: () => GoogleDataDto })
  googleData: GoogleDataDto;

  @ApiProperty({ description: 'Пользовательские настройки отображения', type: () => CustomSettingsDto })
  customSettings: CustomSettingsDto;

  @ApiProperty({
    description: 'Время последнего изменения каждой группы (bunchId → timestamp)',
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  bunchesUpdated: Record<string, number>;

  @ApiPropertyOptional({
    description: 'Вкладки помимо основной',
    type: 'object',
    additionalProperties: { type: 'object' },
  })
  sheets?: Record<string, unknown>;

  @ApiProperty({ description: 'Участники с правами к дашборду', type: [CompanyDashboardMemberDto] })
  dashboardMembers: CompanyDashboardMemberDto[];

  @ApiPropertyOptional({
    description: 'Настройки публичного доступа (dashboardSheetId → boolean)',
    type: 'object',
    additionalProperties: { type: 'boolean' },
  })
  dashboardPublicAccess?: Record<string, boolean>;
}
