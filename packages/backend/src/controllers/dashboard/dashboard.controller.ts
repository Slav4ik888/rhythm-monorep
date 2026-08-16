// packages/backend/src/controllers/dashboard/dashboard.controller.ts
// NestJS-контроллер для dashboard (миграция с Koa)
// Заменяет controllers/dashboard/bunch/get, view/createGroupItems, view/update, view/delete

import { Controller, Post, Patch, Body, HttpCode, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { OptionalFirebaseAuthGuard } from '../../guards/optional-firebase-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { toHttpException } from '../../libs/errors';
import type { User } from '../../models/user';
import { CreateGroupViewItemsDto, DeleteViewsDto, ReqGetBunchesDto, ResGetBunchesDto, UpdateViewItemDto } from './dto';

@ApiTags('dashboard')
@Controller('api')
export class DashboardController {
  // POST /api/dashboard/bunch/get — получение групп дашборда (публичный)
  // eslint-disable-next-line class-methods-use-this
  @Post('/dashboard/bunch/get')
  @ApiOperation({ summary: 'Получение групп элементов дашборда', description: 'POST /api/dashboard/bunch/get' })
  @ApiBody({ type: ReqGetBunchesDto })
  @ApiResponse({ status: 200, description: 'Группы элементов дашборда', type: ResGetBunchesDto })
  @ApiResponse({ status: 429, description: 'Превышен лимит запросов' })
  @HttpCode(200)
  // Rate limiting на публичном read-эндпоинте (защита от DoS). Лимит по умолчанию из app.module (10/мин).
  @UseGuards(OptionalFirebaseAuthGuard, ThrottlerGuard)
  async bunchGet(@Body() body: ReqGetBunches, @CurrentUser() user?: User): Promise<ResGetBunches> {
    try {
      return await getBunchesModel({ ...body, user });
    } catch (err: unknown) {
      throw toHttpException(err);
    }
  }

  // POST /api/dashboard/view/createGroupItems — создание элементов дашборда
  // eslint-disable-next-line class-methods-use-this
  @Post('/dashboard/view/createGroupItems')
  @ApiOperation({ summary: 'Создание элементов дашборда', description: 'POST /api/dashboard/view/createGroupItems' })
  @ApiBody({ type: CreateGroupViewItemsDto })
  @ApiResponse({ status: 200, description: 'Элементы созданы', type: CreateGroupViewItemsDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @HttpCode(200)
  @UseGuards(FirebaseAuthGuard)
  async viewCreateGroupItems(
    @Body() body: CreateGroupViewItems,
    @CurrentUser() user: User,
  ): Promise<CreateGroupViewItems> {
    try {
      const args: CreateGroupViewItemsArgs = { ...body, user };
      return await createGroupViewItemsModel(args);
    } catch (err: unknown) {
      throw toHttpException(err);
    }
  }

  // PATCH /api/dashboard/view/update — обновление элементов дашборда
  // Фронтенд вызывает PATCH (entities/dashboard-view/model/store.ts,
  // shared/api/hooks/use-dashboard-view-queries.ts), как и Koa-роутер (router.patch).
  // eslint-disable-next-line class-methods-use-this
  @Patch('/dashboard/view/update')
  @ApiOperation({ summary: 'Обновление элементов дашборда', description: 'PATCH /api/dashboard/view/update' })
  @ApiBody({ type: UpdateViewItemDto })
  @ApiResponse({ status: 200, description: 'Элементы обновлены', type: UpdateViewItemDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @HttpCode(200)
  @UseGuards(FirebaseAuthGuard)
  async viewUpdate(@Body() body: UpdateViewItem, @CurrentUser() user: User): Promise<UpdateViewItem> {
    try {
      const args: UpdateViewItemArgs = { ...body, user };
      return await updateGroupViewItemsModel(args);
    } catch (err: unknown) {
      throw toHttpException(err);
    }
  }

  // POST /api/dashboard/view/delete — удаление элементов дашборда
  // eslint-disable-next-line class-methods-use-this
  @Post('/dashboard/view/delete')
  @ApiOperation({ summary: 'Удаление элементов дашборда', description: 'POST /api/dashboard/view/delete' })
  @ApiBody({ type: DeleteViewsDto })
  @ApiResponse({ status: 200, description: 'Элементы удалены' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @HttpCode(200)
  @UseGuards(FirebaseAuthGuard)
  async viewDelete(@Body() body: DeleteViews, @CurrentUser() user: User): Promise<Record<string, never>> {
    try {
      const args: DeleteViewsArgs = { ...body, user };
      await deleteViewItemModel(args);
      return {};
    } catch (err: unknown) {
      throw toHttpException(err);
    }
  }
}
