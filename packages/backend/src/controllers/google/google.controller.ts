// packages/backend/src/controllers/google/google.controller.ts
// NestJS-контроллер для google/getData (миграция с Koa)
// Заменяет controllers/google/get-data

import { Controller, Post, Body, Req, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { googleGetDataModel, GoogleGetDataArgs } from '../../models/google/handlers';
import { serviceGetCompany } from '../../models/company';
import { admin } from '../../libs/firebase/config/admin-sdk';
import { cfg } from '../../app/config';
import { GoogleGetDataDto } from './dto';
import { isApiError, type ApiError } from '../../libs/errors';
import type { FastifyRequest } from 'fastify';

/** FastifyRequest с cookies (плагин @fastify/cookie) */
interface RequestWithCookies extends FastifyRequest {
  cookies?: Record<string, string>;
}

@ApiTags('dashboard')
@Controller('api')
export class GoogleController {
  // Маршрут без префикса модуля — как в Koa-роутере (prefix '/api' + '/getData')
  // и во фронтенде (API_PATHS.google.getData = '/getData')
  @Post('/getData')
  @ApiOperation({ summary: 'Получение данных из Google Sheets', description: 'POST /api/getData' })
  @ApiBody({ type: GoogleGetDataDto })
  @ApiResponse({ status: 200, description: 'Данные из Google Таблицы' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @HttpCode(200)
  async getData(@Body() body: GoogleGetDataArgs, @Req() request: RequestWithCookies): Promise<string> {
    try {
      // Условная проверка доступа (как checkUserSession в Koa):
      // публичный дашборд — авторизация не требуется, иначе — нужна сессия
      await this.checkAccess(body.companyId, body.dashboardSheetId, request);

      return await googleGetDataModel(body);
    } catch (err: unknown) {
      // Пробрасываем уже сформированные HttpException (401 из checkAccess и т.п.)
      if (err instanceof HttpException) throw err;

      // Ошибки бизнес-логики модели (выбрасываются с полями statusCode и body)
      if (isApiError(err)) {
        throw new HttpException((err.body as object | string) || err.message, err.statusCode);
      }

      // Ошибка при обращении к внешнему сервису Google Apps Script (axios),
      // напр. ссылка невалидна или деплой скрипта удалён
      const responseStatus = (err as ApiError).response?.status;
      if (typeof responseStatus === 'number') {
        console.error('[GoogleController] Google Apps Script error:', responseStatus, (err as Error).message);
        throw new HttpException(
          { general: 'Не удалось получить данные из Google Таблицы. Проверьте корректность ссылки на таблицу.' },
          HttpStatus.BAD_GATEWAY,
        );
      }

      const message = err instanceof Error ? err.message : String(err);
      throw new HttpException({ general: message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Проверяет доступ к данным Google Таблицы.
   * Для публичных дашбордов (dashboardPublicAccess[dashboardSheetId]) авторизация не требуется —
   * поведение полностью совпадает с Koa-контроллером controllers/google/get-data.
   */
  private async checkAccess(
    companyId: string,
    dashboardSheetId: string | undefined,
    request: RequestWithCookies,
  ): Promise<void> {
    if (!companyId || !dashboardSheetId) return;

    const company = await serviceGetCompany(companyId);

    // Публичный доступ — пропускаем проверку сессии
    if (company?.dashboardPublicAccess?.[dashboardSheetId]) return;

    // Нет публичного доступа — проверяем Firebase session cookie (аналог checkUserSession)
    const sessionCookie = this.extractSessionCookie(request);
    if (!sessionCookie) {
      throw new HttpException({ general: 'Пользователь не авторизован.' }, HttpStatus.UNAUTHORIZED);
    }

    try {
      await admin.auth().verifySessionCookie(sessionCookie, true);
    } catch {
      throw new HttpException({ general: 'Пользователь не авторизован.' }, HttpStatus.UNAUTHORIZED);
    }
  }

  /** Извлекает session cookie из Fastify-запроса (аналогично FirebaseAuthGuard) */
  // eslint-disable-next-line class-methods-use-this
  private extractSessionCookie(request: RequestWithCookies): string | null {
    const cookies = request.cookies || {};
    const cookieValue: string = cookies[cfg.COOKIE_NAME] || '';

    if (!cookieValue) {
      const cookieHeader: string = request.headers?.cookie || '';
      const match = cookieHeader.match(new RegExp(`${cfg.COOKIE_NAME}=([^;]+)`));
      if (match) {
        const parts = match[1].split('/');
        return parts[1] || null;
      }
      return null;
    }

    const parts = cookieValue.split('/');
    return parts[1] || null;
  }
}
