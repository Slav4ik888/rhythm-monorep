// packages/backend/src/controllers/partner/partner.controller.ts
// NestJS-контроллер для partner (миграция с Koa)
// Заменяет controllers/partner/increase-follower/index.ts

import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { increaseFollowerModel, IncreaseFollowerConfig } from '../../models/partner/handlers/increase-follower';
import { toHttpException } from '../../libs/errors';
import { IncreaseFollowerDto } from './dto';

@ApiTags('partner')
@Controller('api')
export class PartnerController {
  // eslint-disable-next-line class-methods-use-this
  @Post('/increaseFollower')
  @ApiOperation({ summary: 'Увеличение счётчика последователей партнёра', description: 'POST /api/increaseFollower' })
  @ApiBody({ type: IncreaseFollowerDto })
  @ApiResponse({
    status: 200,
    description: 'Счётчик увеличен',
    schema: { type: 'object', properties: { status: { type: 'string', example: 'ok' } } },
  })
  @HttpCode(200)
  async increaseFollower(@Body() body: IncreaseFollowerConfig): Promise<{ status: string }> {
    try {
      await increaseFollowerModel(body);
      return { status: 'ok' };
    } catch (err: unknown) {
      throw toHttpException(err);
    }
  }
}
