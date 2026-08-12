// packages/backend/src/controllers/google/google.controller.ts
// NestJS-контроллер для google/getData (миграция с Koa)
// Заменяет controllers/google/get-data

import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { googleGetDataModel, GoogleGetDataArgs } from '../../models/google/handlers';

@Controller('api')
export class GoogleController {
  // eslint-disable-next-line class-methods-use-this
  @Post('/google/getData')
  async getData(@Body() body: GoogleGetDataArgs): Promise<string> {
    try {
      // TODO: добавить условный guard для проверки сессии (как checkUserSession в Koa)
      // когда dashboardSheetId не имеет публичного доступа
      return await googleGetDataModel(body);
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
