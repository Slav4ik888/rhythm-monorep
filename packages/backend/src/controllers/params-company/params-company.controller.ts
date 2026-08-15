// packages/backend/src/controllers/params-company/params-company.controller.ts
// NestJS-контроллер для params-company (миграция с Koa)
// Заменяет controllers/params-company/get/index.ts

import { Controller, Get, Post, Query, Body, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { getParamsCompanyModel, GetParamsCompanyArgs } from '../../models/params-company/handlers/get';
import { Company } from '../../models/company';

@Controller('api')
export class ParamsCompanyController {
  // eslint-disable-next-line class-methods-use-this
  @Get('/paramsCompany/get')
  async getParamsCompanyGet(@Query() query: GetParamsCompanyArgs): Promise<Company> {
    try {
      return await getParamsCompanyModel(query);
    } catch (err: any) {
      // Пробрасываем ошибки из модели (с сохранением statusCode и body)
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  @Post('/paramsCompany/get')
  @HttpCode(200)
  async postParamsCompanyGet(@Body() body: GetParamsCompanyArgs): Promise<Company> {
    try {
      return await getParamsCompanyModel(body);
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
