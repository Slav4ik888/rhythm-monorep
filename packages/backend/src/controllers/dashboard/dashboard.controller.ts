// packages/backend/src/controllers/dashboard/dashboard.controller.ts
// NestJS-контроллер для dashboard (миграция с Koa)
// Заменяет controllers/dashboard/bunch/get, view/createGroupItems, view/update, view/delete

import { Controller, Post, Patch, Body, HttpException, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { getBunchesModel, ReqGetBunches, ResGetBunches } from '../../models/dashboard-view/handlers-bunch/get';
import {
  createGroupViewItemsModel,
  CreateGroupViewItems,
  CreateGroupViewItemsArgs,
} from '../../models/dashboard-view/handlers-view/create-group-items';
import {
  updateGroupViewItemsModel,
  UpdateViewItem,
  UpdateViewItemArgs,
} from '../../models/dashboard-view/handlers-view/update';
import { deleteViewItemModel, DeleteViews, DeleteViewsArgs } from '../../models/dashboard-view/handlers-view/delete';
import { FirebaseAuthGuard } from '../../guards/firebase-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';

@ApiTags('dashboard')
@Controller('api')
export class DashboardController {
  // POST /api/dashboard/bunch/get — получение групп дашборда (публичный)
  // eslint-disable-next-line class-methods-use-this
  @Post('/dashboard/bunch/get')
  @ApiOperation({ summary: 'Получение групп элементов дашборда', description: 'POST /api/dashboard/bunch/get' })
  @ApiResponse({ status: 200, description: 'Группы элементов дашборда' })
  @HttpCode(200)
  async bunchGet(@Body() body: ReqGetBunches): Promise<ResGetBunches> {
    try {
      return await getBunchesModel(body);
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // POST /api/dashboard/view/createGroupItems — создание элементов дашборда
  // eslint-disable-next-line class-methods-use-this
  @Post('/dashboard/view/createGroupItems')
  @ApiOperation({ summary: 'Создание элементов дашборда', description: 'POST /api/dashboard/view/createGroupItems' })
  @ApiResponse({ status: 200, description: 'Элементы созданы' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @HttpCode(200)
  @UseGuards(FirebaseAuthGuard)
  async viewCreateGroupItems(
    @Body() body: CreateGroupViewItems,
    @CurrentUser() user: any,
  ): Promise<CreateGroupViewItems> {
    try {
      const args: CreateGroupViewItemsArgs = { ...body, userId: user.id };
      return await createGroupViewItemsModel(args);
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // PATCH /api/dashboard/view/update — обновление элементов дашборда
  // Фронтенд вызывает PATCH (entities/dashboard-view/model/store.ts,
  // shared/api/hooks/use-dashboard-view-queries.ts), как и Koa-роутер (router.patch).
  // eslint-disable-next-line class-methods-use-this
  @Patch('/dashboard/view/update')
  @ApiOperation({ summary: 'Обновление элементов дашборда', description: 'PATCH /api/dashboard/view/update' })
  @ApiResponse({ status: 200, description: 'Элементы обновлены' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @HttpCode(200)
  @UseGuards(FirebaseAuthGuard)
  async viewUpdate(@Body() body: UpdateViewItem, @CurrentUser() user: any): Promise<UpdateViewItem> {
    try {
      const args: UpdateViewItemArgs = { ...body, userId: user.id };
      return await updateGroupViewItemsModel(args);
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // POST /api/dashboard/view/delete — удаление элементов дашборда
  // eslint-disable-next-line class-methods-use-this
  @Post('/dashboard/view/delete')
  @ApiOperation({ summary: 'Удаление элементов дашборда', description: 'POST /api/dashboard/view/delete' })
  @ApiResponse({ status: 200, description: 'Элементы удалены' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @HttpCode(200)
  @UseGuards(FirebaseAuthGuard)
  async viewDelete(@Body() body: DeleteViews, @CurrentUser() user: any): Promise<any> {
    try {
      const args: DeleteViewsArgs = { ...body, userId: user.id };
      await deleteViewItemModel(args);
      return {};
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
