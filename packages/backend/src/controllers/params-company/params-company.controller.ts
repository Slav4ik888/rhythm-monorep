// packages/backend/src/controllers/params-company/params-company.controller.ts
// NestJS-контроллер для params-company (миграция с Koa)
// Заменяет controllers/params-company/get/index.ts

import { Controller, Get, Post, Query, Body, HttpCode } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { getParamsCompanyModel, GetParamsCompanyArgs } from '../../models/params-company/handlers/get';
import { Company } from '../../models/company';
import { toHttpException } from '../../libs/errors';
import { CompanyDto } from '../../dto/company.dto';
import { GetParamsCompanyDto } from './dto';

@ApiTags('params-company')
@Controller('api')
export class ParamsCompanyController {
  // eslint-disable-next-line class-methods-use-this
  @Get('/paramsCompany/get')
  @ApiOperation({ summary: 'Получение параметров компании', description: 'GET /api/paramsCompany/get' })
  @ApiQuery({ name: 'companyId', description: 'ID компании', required: true, type: String })
  @ApiQuery({
    name: 'dashboardSheetId',
    description: 'ID листа, к которому запрашивается доступ',
    required: false,
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Параметры компании', type: CompanyDto })
  async getParamsCompanyGet(@Query() query: GetParamsCompanyArgs): Promise<Company> {
    try {
      return await getParamsCompanyModel(query);
    } catch (err: unknown) {
      throw toHttpException(err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  @Post('/paramsCompany/get')
  @ApiOperation({ summary: 'Получение параметров компании', description: 'POST /api/paramsCompany/get' })
  @ApiBody({ type: GetParamsCompanyDto })
  @ApiResponse({ status: 200, description: 'Параметры компании', type: CompanyDto })
  @HttpCode(200)
  async postParamsCompanyGet(@Body() body: GetParamsCompanyArgs): Promise<Company> {
    try {
      return await getParamsCompanyModel(body);
    } catch (err: unknown) {
      throw toHttpException(err);
    }
  }
}
