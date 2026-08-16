// packages/backend/src/controllers/user/user.controller.ts
// NestJS-контроллер для user (миграция с Koa)
// Заменяет controllers/user/get-auth/index.ts, controllers/user/update/index.ts, controllers/user/logout/index.ts

import { Controller, Get, Post, Body, HttpException, HttpStatus, HttpCode, UseGuards, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { getAuthModel, GetAuthArgs, ResGetAuth } from '../../models/user/handlers/get-auth';
import { updateUserModel, UpdateUserArgs } from '../../models/user/handlers/update';
import { FirebaseAuthGuard } from '../../guards/firebase-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { PartialUser } from '../../models/user/types';
import { SuccessResponseDto } from '../../dto/common.dto';
import { ResGetAuthDto, UpdateUserDto } from './dto';
import { cfg } from '../../app/config';

@ApiTags('user')
@Controller('api')
export class UserController {
  // GET /api/user/getAuth — получение данных пользователя и компании
  // eslint-disable-next-line class-methods-use-this
  @Get('/user/getAuth')
  @ApiOperation({ summary: 'Получение данных пользователя и компании', description: 'GET /api/user/getAuth' })
  @ApiResponse({ status: 200, description: 'Данные пользователя и компании', type: ResGetAuthDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @UseGuards(FirebaseAuthGuard)
  async getAuth(@CurrentUser() user: any): Promise<ResGetAuth> {
    try {
      const args: GetAuthArgs = {
        userId: user.id,
        companyId: user.companyId,
      };
      return await getAuthModel(args);
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // POST /api/user/update — обновление данных пользователя
  // eslint-disable-next-line class-methods-use-this
  @Post('/user/update')
  @ApiOperation({ summary: 'Обновление данных пользователя', description: 'POST /api/user/update' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Пользователь обновлён', type: SuccessResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @HttpCode(200)
  @UseGuards(FirebaseAuthGuard)
  async update(@Body() body: { userData: PartialUser }, @CurrentUser() user: any): Promise<any> {
    try {
      const args: UpdateUserArgs = {
        userData: body.userData,
        userId: user.id,
      };
      await updateUserModel(args);
      return { success: true };
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // POST /api/user/logout — выход из аккаунта (очистка cookie + редирект)
  // eslint-disable-next-line class-methods-use-this
  @Post('/user/logout')
  @ApiOperation({ summary: 'Выход из аккаунта', description: 'POST /api/user/logout' })
  @ApiResponse({ status: 302, description: 'Очистка cookie и редирект на главную' })
  @HttpCode(302)
  async logout(@Res() reply: FastifyReply): Promise<void> {
    // Очищаем cookie сессии
    reply.header('Set-Cookie', `${cfg.COOKIE_NAME}=; Path=/; Max-Age=0`);
    // Редирект на главную (как в Koa-версии)
    reply.redirect('/');
  }
}
