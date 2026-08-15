// packages/backend/src/controllers/templates/templates.controller.ts
// NestJS-контроллер для templates (миграция с Koa)
// Заменяет controllers/templates/{get-bunches-updated, get-templates, update, delete}

import { Controller, Get, Post, Body, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { getBunchesUpdatedModel } from '../../models/templates/handlers/get-bunches-updated';
import { getTemplatesModel, ReqGetTemplates, ResGetTemplates } from '../../models/templates/handlers/get-templates';
import { updateTemplateModel, UpdateTemplate } from '../../models/templates/handlers/update';
import { deleteTemlateModel, DeleteTemplate } from '../../models/templates/handlers/delete';
import { BunchesUpdated } from '../../shared/lib/structures/bunch';

@Controller('api')
export class TemplatesController {
  // eslint-disable-next-line class-methods-use-this
  @Get('/templates/getBunchesUpdated')
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
