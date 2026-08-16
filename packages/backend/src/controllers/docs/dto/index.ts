// packages/backend/src/controllers/docs/dto/index.ts
// DTO ответов DocsController для Swagger-документации.

import { ApiProperty } from '@nestjs/swagger';

/** Ответ получения политики конфиденциальности */
export class GetPolicyResponseDto {
  @ApiProperty({ description: 'Текст политики конфиденциальности (Markdown)' })
  policy: string;
}
