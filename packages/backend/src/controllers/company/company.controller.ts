// packages/backend/src/controllers/company/company.controller.ts
// NestJS-контроллер для company (миграция с Koa)
// Заменяет controllers/company/update/index.ts и controllers/company/delete-sheet/index.ts

import { Controller, Post, Body, HttpException, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { updateCompanyModel, UpdateCompanyArgs } from '../../models/company/handlers/update';
import { companyDeleteSheetModel, DeleteSheetArgs } from '../../models/company/handlers/delete-sheet';
import { FirebaseAuthGuard } from '../../guards/firebase-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';

@Controller('api')
@UseGuards(FirebaseAuthGuard)
export class CompanyController {
  // eslint-disable-next-line class-methods-use-this
  @Post('/company/update')
  @HttpCode(200)
  async update(@Body() body: { companyData: any }, @CurrentUser() user: any): Promise<any> {
    try {
      const args: UpdateCompanyArgs = {
        companyData: body.companyData,
        userId: user.id,
      };
      return await updateCompanyModel(args);
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  @Post('/company/deleteSheet')
  @HttpCode(200)
  async deleteSheet(@Body() body: { companyId: string; sheetId: string }, @CurrentUser() user: any): Promise<any> {
    try {
      const args: DeleteSheetArgs = {
        companyId: body.companyId,
        sheetId: body.sheetId,
        userId: user.id,
      };
      await companyDeleteSheetModel(args);
      return body;
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
