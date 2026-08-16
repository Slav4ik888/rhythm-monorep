// packages/backend/src/controllers/loggers/loggers.controller.ts
// NestJS-контроллер для loggers (миграция с Koa)
// Заменяет controllers/loggers/view, download, clear

import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { FastifyReply } from 'fastify';
import { logsViewModel } from '../../models/loggers/handlers/view';
import { logsDownloadModel } from '../../models/loggers/handlers/download';
import { logsClearModel } from '../../models/loggers/handlers/clear';

@ApiTags('logs')
@Controller('api/logs')
export class LoggersController {
  // eslint-disable-next-line class-methods-use-this
  @Get('view/:name/:pass')
  @ApiOperation({ summary: 'Просмотр лога', description: 'GET /api/logs/view/:name/:pass' })
  @ApiParam({ name: 'name', description: 'Имя лог-файла' })
  @ApiParam({ name: 'pass', description: 'Пароль доступа' })
  @ApiResponse({ status: 200, description: 'HTML-представление лога' })
  async viewLog(@Param('name') name: string, @Param('pass') pass: string, @Res() reply: FastifyReply): Promise<void> {
    const result = await logsViewModel({ name, pass });

    reply.status(result.statusCode).header('Content-Type', 'text/html; charset=utf-8').send(result.html);
  }

  // eslint-disable-next-line class-methods-use-this
  @Get('download/:name/:pass')
  @ApiOperation({ summary: 'Скачивание лога', description: 'GET /api/logs/download/:name/:pass' })
  @ApiParam({ name: 'name', description: 'Имя лог-файла' })
  @ApiParam({ name: 'pass', description: 'Пароль доступа' })
  @ApiResponse({ status: 200, description: 'Файл лога' })
  async downloadLog(
    @Param('name') name: string,
    @Param('pass') pass: string,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    const result = await logsDownloadModel({ name, pass });

    if (result.contentType) {
      reply.header('Content-Type', result.contentType);
    }
    if (result.contentDisposition) {
      reply.header('Content-Disposition', result.contentDisposition);
    }

    reply.status(result.statusCode);

    if (result.body && typeof result.body !== 'string') {
      // Файловый стрим для скачивания
      reply.send(result.body);
    } else {
      reply.send(result.body || '');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  @Get('clear/:name/:pass')
  @ApiOperation({ summary: 'Очистка лога', description: 'GET /api/logs/clear/:name/:pass' })
  @ApiParam({ name: 'name', description: 'Имя лог-файла' })
  @ApiParam({ name: 'pass', description: 'Пароль доступа' })
  @ApiResponse({ status: 200, description: 'Результат очистки' })
  async clearLog(@Param('name') name: string, @Param('pass') pass: string, @Res() reply: FastifyReply): Promise<void> {
    const result = await logsClearModel({ name, pass });

    reply.status(result.statusCode).header('Content-Type', 'application/json; charset=utf-8').send(result.body);
  }
}
