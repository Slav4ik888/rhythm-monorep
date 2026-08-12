// packages/backend/src/controllers/docs/docs.controller.ts
// NestJS-контроллер для docs (миграция с Koa)
// Заменяет controllers/docs/get-policy/index.ts

import { Controller, Get } from '@nestjs/common';
import { getPolicyModel } from '../../models/docs/handlers/get-policy';

@Controller('api')
export class DocsController {
  // eslint-disable-next-line class-methods-use-this
  @Get('/getPolicy')
  async getPolicy(): Promise<{ policy: string }> {
    return getPolicyModel();
  }
}
