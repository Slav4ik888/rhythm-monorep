// packages/backend/src/controllers/company/company.controller.ts
// NestJS-контроллер для company (миграция с Koa)
// Заменяет controllers/company/update/index.ts и controllers/company/delete-sheet/index.ts

import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { updateCompanyModel, UpdateCompanyArgs } from '../../models/company/handlers/update';
import { companyDeleteSheetModel, DeleteSheetArgs } from '../../models/company/handlers/delete-sheet';
import { FirebaseAuthGuard } from '../../guards/firebase-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { toHttpException } from '../../libs/errors';
import type { User } from '../../models/user';
import type { PartialCompany } from '../../models/company/types';
import { CompanyDto } from '../../dto/company.dto';
import { DeleteSheetDto, UpdateCompanyDto } from './dto';

@ApiTags('company')
@Controller('api')
@UseGuards(FirebaseAuthGuard)
export class CompanyController {
  // eslint-disable-next-line class-methods-use-this
  @Post('/company/update')
  @ApiOperation({ summary: 'Обновление данных компании', description: 'POST /api/company/update' })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiResponse({ status: 200, description: 'Компания обновлена', type: CompanyDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @HttpCode(200)
  async update(@Body() body: { companyData: PartialCompany }, @CurrentUser() user: User): Promise<PartialCompany> {
    try {
      const args: UpdateCompanyArgs = {
        companyData: body.companyData,
        user,
      };
      return await updateCompanyModel(args);
    } catch (err: unknown) {
      throw toHttpException(err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  @Post('/company/deleteSheet')
  @ApiOperation({ summary: 'Удаление листа компании', description: 'POST /api/company/deleteSheet' })
  @ApiBody({ type: DeleteSheetDto })
  @ApiResponse({ status: 200, description: 'Лист удалён', type: DeleteSheetDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @HttpCode(200)
  async deleteSheet(
    @Body() body: { companyId: string; sheetId: string },
    @CurrentUser() user: User,
  ): Promise<{ companyId: string; sheetId: string }> {
    try {
      const args: DeleteSheetArgs = {
        companyId: body.companyId,
        sheetId: body.sheetId,
        user,
      };
      await companyDeleteSheetModel(args);
      return body;
    } catch (err: unknown) {
      throw toHttpException(err);
    }
  }
}
