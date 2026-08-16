/* eslint-disable max-classes-per-file -- DTO-файл объединяет связанные схемы */
// packages/backend/src/dto/user.dto.ts
// DTO сущности пользователя для Swagger-документации.

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ItemBaseDto } from './base.dto';

/** ФИО пользователя */
export class FioDto {
  @ApiProperty({ description: 'Имя' })
  firstName: string;

  @ApiProperty({ description: 'Фамилия' })
  secondName: string;

  @ApiProperty({ description: 'Отчество' })
  middleName: string;
}

/** Персональные данные пользователя */
export class PersonDto {
  @ApiProperty({ description: 'Имя, выводимое в бейджиках' })
  displayName: string;

  @ApiProperty({ description: 'URL аватара' })
  avatarUrl: string;

  @ApiProperty({ description: 'Номер телефона (на который производилась регистрация)', example: '+15555550003' })
  phoneNumber: string;

  @ApiProperty({ description: 'ФИО', type: () => FioDto })
  fio: FioDto;
}

/** Партнёрские данные пользователя */
export class UserPartnerDataDto {
  @ApiProperty({ description: 'ID пользователя как партнёра' })
  partnerId: string;

  @ApiProperty({ description: 'ID партнёра, который привёл пользователя по реферальной ссылке' })
  referrerId: string;
}

/** Настройки пользователя */
export class UserSettingsDto {
  @ApiPropertyOptional({ description: 'ID подсказок, которые пользователь не хочет видеть снова' })
  hintsDontShowAgain?: string[];
}

/** Пользователь */
export class UserDto extends ItemBaseDto {
  @ApiProperty({ description: 'ID компании' })
  companyId: string;

  @ApiProperty({ description: 'Персональные данные', type: () => PersonDto })
  person: PersonDto;

  @ApiProperty({ description: 'Email', example: 'korzan.va@mail.ru' })
  email: string;

  @ApiProperty({ description: 'Согласие на обработку персональных данных' })
  permissions: boolean;

  @ApiProperty({ description: 'Роль в приложении', enum: ['Super admin', 'Developer', 'Owner', 'Employee'] })
  role: string;

  @ApiProperty({ description: 'Подтверждён ли email' })
  emailVerified: boolean;

  @ApiProperty({ description: 'Статус пользователя', enum: ['NEW', 'VERIFIED', 'ACTIVE', 'DISABLED', 'DELETED'] })
  status: string;

  @ApiPropertyOptional({ description: 'Временный запрет на доступ к Конструктору' })
  isEditAccess?: boolean;

  @ApiPropertyOptional({ description: 'Настройки', type: () => UserSettingsDto })
  settings?: UserSettingsDto;

  @ApiProperty({ description: 'Партнёрские данные', type: () => UserPartnerDataDto })
  partner: UserPartnerDataDto;
}
