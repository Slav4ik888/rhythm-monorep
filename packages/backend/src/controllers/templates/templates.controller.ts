// packages/backend/src/controllers/templates/templates.controller.ts
// NestJS-контроллер для templates (миграция с Koa)
// Заменяет controllers/templates/{get-bunches-updated, get-templates, update, delete}

import { Controller, Get, Post, Body, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { getBunchesUpdatedModel } from '../../models/templates/handlers/get-bunches-updated';
import { getTemplatesModel, ReqGetTemplates, ResGetTemplates } from '../../models/templates/handlers/get-templates';
import { updateTemplateModel, UpdateTemplate } from '../../models/templates/handlers/update';
import { deleteTemlateModel, DeleteTemplate } from '../../models/templates/handlers/delete';
import { BunchesUpdated } from '../../shared/lib/structures/bunch';
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
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
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
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  @Post('/templates/update')
  @ApiOperation({ summary: 'Обновление шаблона', description: 'POST /api/templates/update' })
  @ApiBody({ type: UpdateTemplateDto })
  @ApiResponse({ status: 200, description: 'Шаблон обновлён', type: UpdateTemplateDto })
  @HttpCode(200)
  async updateTemplate(@Body() body: UpdateTemplate & { userId?: string }): Promise<UpdateTemplate> {
    try {
      // TODO: получать userId из FirebaseAuthGuard, пока берём из body или используем заглушку
      const userId = body.userId || 'system';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userId: _uid, ...rest } = body;
      return await updateTemplateModel({ ...rest, userId });
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  @Post('/templates/delete')
  @ApiOperation({ summary: 'Удаление шаблона', description: 'POST /api/templates/delete' })
  @ApiBody({ type: DeleteTemplateDto })
  @ApiResponse({ status: 200, description: 'Шаблон удалён', type: DeleteTemplateDto })
  @HttpCode(200)
  async deleteTemplate(@Body() body: DeleteTemplate): Promise<DeleteTemplate> {
    try {
      return await deleteTemlateModel(body);
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
