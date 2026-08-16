/* eslint-disable max-classes-per-file -- DTO-файл объединяет связанные схемы запросов/ответов */
// packages/backend/src/controllers/user/dto/index.ts
// DTO запросов/ответов UserController для Swagger-документации.

import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../../dto/user.dto';
import { CompanyDto } from '../../../dto/company.dto';

/** Тело обновления данных пользователя */
export class UpdateUserDto {
  @ApiProperty({ description: 'Данные пользователя для обновления (частичное обновление)', type: () => UserDto })
  userData: UserDto;
}

/** Ответ getAuth: данные пользователя и компании */
export class ResGetAuthDto {
  @ApiProperty({ description: 'Данные пользователя', type: () => UserDto })
  userData: UserDto;

  @ApiProperty({ description: 'Данные компании', type: () => CompanyDto })
  companyData: CompanyDto;
}
