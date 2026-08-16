/* eslint-disable max-classes-per-file -- DTO-файл объединяет связанные схемы запросов/ответов */
// packages/backend/src/controllers/auth/dto/index.ts
// DTO запросов/ответов AuthController для Swagger-документации.

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto } from '../../../dto/user.dto';
import { CompanyDto } from '../../../dto/company.dto';

/** Данные входа по email */
export class AuthByLoginDto {
  @ApiProperty({ description: 'Email', example: 'korzan.va@mail.ru' })
  email: string;

  @ApiProperty({ description: 'Пароль' })
  password: string;
}

/** Тело запроса входа */
export class LoginByEmailDto {
  @ApiProperty({ description: 'Данные входа', type: () => AuthByLoginDto })
  authByLogin: AuthByLoginDto;
}

/** Ответ входа */
export class LoginResponseDto {
  @ApiProperty({ description: 'Данные пользователя', type: () => UserDto })
  user: UserDto;

  @ApiProperty({ description: 'Данные компании', type: () => CompanyDto })
  company: CompanyDto;

  @ApiProperty({ description: 'Сообщение' })
  message: string;
}

/** Данные регистрации */
export class SignupDataDto {
  @ApiPropertyOptional({ description: 'Название компании' })
  companyName?: string;

  @ApiProperty({ description: 'Имя' })
  firstName: string;

  @ApiPropertyOptional({ description: 'Фамилия' })
  secondName?: string;

  @ApiPropertyOptional({ description: 'Отчество' })
  middleName?: string;

  @ApiPropertyOptional({ description: 'Номер телефона' })
  phoneNumber?: string;

  @ApiProperty({ description: 'Email' })
  email: string;

  @ApiProperty({ description: 'Пароль' })
  password: string;

  @ApiProperty({ description: 'Подтверждение пароля' })
  confirmPassword: string;

  @ApiPropertyOptional({ description: 'ID партнёра-реферера (пустая строка при отсутствии)', nullable: true })
  partnerId?: string | null;

  @ApiProperty({ description: 'Согласие на обработку персональных данных' })
  permissions: boolean;

  @ApiProperty({ description: 'С какого устройства вошёл (мобильное — true)' })
  isMobile: boolean;
}

/** Тело начала регистрации / повторной отправки кода */
export class SignupByEmailStartDto {
  @ApiProperty({ description: 'Данные регистрации', type: () => SignupDataDto })
  signupData: SignupDataDto;
}

/** Данные завершения регистрации */
export class SignupDataEndDto {
  @ApiProperty({ description: 'Email' })
  email: string;

  @ApiProperty({ description: 'Код подтверждения из письма' })
  emailCode: string;
}

/** Тело завершения регистрации */
export class SignupByEmailEndDto {
  @ApiProperty({ description: 'Данные завершения регистрации', type: () => SignupDataEndDto })
  signupDataEnd: SignupDataEndDto;
}

/** Ответ завершения регистрации */
export class SignupByEmailEndResponseDto {
  @ApiProperty({ description: 'Данные нового пользователя', type: () => UserDto })
  newUserData: UserDto;

  @ApiProperty({ description: 'Данные новой компании', type: () => CompanyDto })
  newCompanyData: CompanyDto;

  @ApiProperty({ description: 'Сообщение' })
  message: string;
}

/** Тело сброса пароля */
export class ResetEmailPasswordDto {
  @ApiProperty({ description: 'Email для сброса пароля' })
  email: string;
}
