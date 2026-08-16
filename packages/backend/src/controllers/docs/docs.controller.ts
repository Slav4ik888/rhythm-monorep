// packages/backend/src/controllers/docs/docs.controller.ts
// NestJS-контроллер для docs (миграция с Koa)
// Заменяет controllers/docs/get-policy/index.ts

import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { getPolicyModel } from '../../models/docs/handlers/get-policy';
import { GetPolicyResponseDto } from './dto';

@ApiTags('docs')
@Controller('api')
export class DocsController {
  // eslint-disable-next-line class-methods-use-this
  @Get('/getPolicy')
  @ApiOperation({ summary: 'Получение политики конфиденциальности', description: 'GET /api/getPolicy' })
  @ApiResponse({ status: 200, description: 'Текст политики', type: GetPolicyResponseDto })
  async getPolicy(): Promise<{ policy: string }> {
    return getPolicyModel();
  }
}
