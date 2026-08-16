// packages/backend/src/controllers/partner/partner.controller.ts
// NestJS-контроллер для partner (миграция с Koa)
// Заменяет controllers/partner/increase-follower/index.ts

import { Controller, Post, Body, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { increaseFollowerModel, IncreaseFollowerConfig } from '../../models/partner/handlers/increase-follower';

@ApiTags('partner')
@Controller('api')
export class PartnerController {
  // eslint-disable-next-line class-methods-use-this
  @Post('/increaseFollower')
  @ApiOperation({ summary: 'Увеличение счётчика последователей партнёра', description: 'POST /api/increaseFollower' })
  @ApiResponse({ status: 200, description: 'Счётчик увеличен' })
  @HttpCode(200)
  async increaseFollower(@Body() body: IncreaseFollowerConfig): Promise<{ status: string }> {
    try {
      await increaseFollowerModel(body);
      return { status: 'ok' };
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
