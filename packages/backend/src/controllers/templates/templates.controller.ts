// packages/backend/src/controllers/templates/templates.controller.ts
// NestJS-контроллер для templates (миграция с Koa)
// Заменяет controllers/templates/{get-bunches-updated, get-templates, update, delete}

import { Controller, Get, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { getBunchesUpdatedModel } from '../../models/templates/handlers/get-bunches-updated';
import { getTemplatesModel, ReqGetTemplates, ResGetTemplates } from '../../models/templates/handlers/get-templates';
import { updateTemplateModel, UpdateTemplate, UpdateTemplateArgs } from '../../models/templates/handlers/update';
import { deleteTemlateModel, DeleteTemplate, DeleteTemplateArgs } from '../../models/templates/handlers/delete';
import { FirebaseAuthGuard } from '../../guards/firebase-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import type { User } from '../../models/user';
import { BunchesUpdated } from '../../shared/lib/structures/bunch';
import { toHttpException } from '../../libs/errors';
import { DeleteTemplateDto, ReqGetTemplatesDto, ResGetTemplatesDto, UpdateTemplateDto } from './dto';

@ApiTags('templates')
@Controller('api')
export class TemplatesController {
  // eslint-disable-next-line class-methods-use-this
  @Get('/templates/getBunchesUpdated')
  @ApiOperation({
    summary: 'Получение обновлённых групп шаблонов',
    description: 'GET /api/templates/getBunchesUpdated',
  })
  @ApiResponse({
    status: 200,
    description: 'Обновлённые группы шаблонов',
    schema: { type: 'object', additionalProperties: { type: 'number' } },
  })
  async getBunchesUpdated(): Promise<BunchesUpdated> {
    try {
      return await getBunchesUpdatedModel();
    } catch (err: unknown) {
      throw toHttpException(err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  @Post('/templates/getTemplates')
  @ApiOperation({ summary: 'Получение шаблонов', description: 'POST /api/templates/getTemplates' })
  @ApiBody({ type: ReqGetTemplatesDto })
  @ApiResponse({ status: 200, description: 'Список шаблонов', type: ResGetTemplatesDto })
  @HttpCode(200)
  async getTemplates(@Body() body: ReqGetTemplates): Promise<ResGetTemplates> {
    try {
      return await getTemplatesModel(body);
    } catch (err: unknown) {
      throw toHttpException(err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  @Post('/templates/update')
  @ApiOperation({ summary: 'Обновление шаблона', description: 'POST /api/templates/update' })
  @ApiBody({ type: UpdateTemplateDto })
  @ApiResponse({ status: 200, description: 'Шаблон обновлён', type: UpdateTemplateDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @HttpCode(200)
  @UseGuards(FirebaseAuthGuard)
  async updateTemplate(@Body() body: UpdateTemplate, @CurrentUser() user: User): Promise<UpdateTemplate> {
    try {
      const args: UpdateTemplateArgs = { ...body, user };
      return await updateTemplateModel(args);
    } catch (err: unknown) {
      throw toHttpException(err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  @Post('/templates/delete')
  @ApiOperation({ summary: 'Удаление шаблона', description: 'POST /api/templates/delete' })
  @ApiBody({ type: DeleteTemplateDto })
  @ApiResponse({ status: 200, description: 'Шаблон удалён', type: DeleteTemplateDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @HttpCode(200)
  @UseGuards(FirebaseAuthGuard)
  async deleteTemplate(@Body() body: DeleteTemplate, @CurrentUser() user: User): Promise<DeleteTemplate> {
    try {
      const args: DeleteTemplateArgs = { ...body, user };
      return await deleteTemlateModel(args);
    } catch (err: unknown) {
      throw toHttpException(err);
    }
  }
}
