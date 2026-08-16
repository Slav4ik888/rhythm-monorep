// packages/backend/src/app.module.ts
// Корневой модуль NestJS (миграция с Koa)
// Объединяет все контроллеры и провайдеры

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { DocsModule } from './controllers/docs/docs.module';
import { ParamsCompanyModule } from './controllers/params-company/params-company.module';
import { PartnerModule } from './controllers/partner/partner.module';
import { LoggersModule } from './controllers/loggers/loggers.module';
import { TemplatesModule } from './controllers/templates/templates.module';
import { GoogleModule } from './controllers/google/google.module';
import { CompanyModule } from './controllers/company/company.module';
import { UserModule } from './controllers/user/user.module';
import { AuthModule } from './controllers/auth/auth.module';
import { DashboardModule } from './controllers/dashboard/dashboard.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { CheckVersionInterceptor } from './interceptors/check-version.interceptor';

@Module({
  imports: [
    // Rate limiting (глобально, @Global()). По умолчанию 10 запросов/мин на IP.
    // На auth-эндпоинтах лимиты переопределяются через @Throttle в AuthController.
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 10,
      },
    ]),
    DocsModule,
    ParamsCompanyModule,
    PartnerModule,
    LoggersModule,
    TemplatesModule,
    GoogleModule,
    CompanyModule,
    UserModule,
    AuthModule,
    DashboardModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CheckVersionInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  // eslint-disable-next-line class-methods-use-this
  configure(_consumer: MiddlewareConsumer) {
    // TODO: мигрировать Koa-middleware в NestJS:
    // - session-caches (checkUserSession) — частично покрыто FirebaseAuthGuard + checkAccess в google.controller
  }
}
