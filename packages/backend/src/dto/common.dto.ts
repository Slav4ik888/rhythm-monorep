/* eslint-disable max-classes-per-file -- DTO-файл объединяет связанные схемы */
// packages/backend/src/dto/common.dto.ts
// Общие DTO ответов: сообщения, статусы.

import { ApiProperty } from '@nestjs/swagger';

/** Ответ с единственным сообщением */
export class MessageResponseDto {
  @ApiProperty({ description: 'Текст сообщения', example: 'Код подтверждения отправлен' })
  message: string;
}

/** Ответ с флагом успешности и сообщением */
export class SuccessMessageResponseDto {
  @ApiProperty({ description: 'Флаг успешности операции', example: true })
  success: boolean;

  @ApiProperty({ description: 'Текст сообщения' })
  message: string;
}

/** Ответ с флагом успешности */
export class SuccessResponseDto {
  @ApiProperty({ description: 'Флаг успешности операции', example: true })
  success: boolean;
}
