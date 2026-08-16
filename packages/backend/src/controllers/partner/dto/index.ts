// packages/backend/src/controllers/partner/dto/index.ts
// DTO запросов/ответов PartnerController для Swagger-документации.

import { ApiProperty } from '@nestjs/swagger';

/** Тело увеличения счётчика последователей партнёра */
export class IncreaseFollowerDto {
  @ApiProperty({ description: 'ID партнёра' })
  partnerId: string;
}
