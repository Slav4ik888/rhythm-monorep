// packages/backend/src/app.module.ts
// Корневой модуль NestJS (миграция с Koa)
// Объединяет все контроллеры и провайдеры

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DocsModule } from './controllers/docs/docs.module';
import { ParamsCompanyModule } from './controllers/params-company/params-company.module';
import { PartnerModule } from './controllers/partner/partner.module';
import { LoggersModule } from './controllers/loggers/loggers.module';
import { TemplatesModule } from './controllers/templates/templates.module';
import { GoogleModule } from './controllers/google/google.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Module({
  imports: [
    DocsModule,
    ParamsCompanyModule,
    PartnerModule,
    LoggersModule,
    TemplatesModule,
    GoogleModule,
    // TODO: добавить остальные модули по мере миграции
    // AuthModule, UserModule, CompanyModule, DashboardModule, etc.
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  // eslint-disable-next-line class-methods-use-this
  configure(_consumer: MiddlewareConsumer) {
    // TODO: мигрировать Koa-middleware в NestJS:
    // - check-version (cv)  — будет добавлен как Guard или Interceptor
    // - session-caches (checkUserSession) — будет добавлен как Guard
  }
}
