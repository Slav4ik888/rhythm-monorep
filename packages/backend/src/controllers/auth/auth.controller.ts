// packages/backend/src/controllers/auth/auth.controller.ts
// NestJS-контроллер для auth (миграция с Koa)
// Заменяет controllers/auth/login, signup, reset-email-password

import { Controller, Post, Body, HttpStatus, HttpCode, Res, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { loginModel, LoginArgs, LoginResult } from '../../models/auth/login';
import {
  signupByEmailStartModel,
  SignupByEmailStartArgs,
  SignupByEmailStartResult,
} from '../../models/auth/signup/handlers/by-email-start';
import {
  signupByEmailEndModel,
  SignupByEmailEndArgs,
  SignupByEmailEndResult,
} from '../../models/auth/signup/handlers/by-email-end';
import {
  signupSendCodeModel,
  SignupSendCodeArgs,
  SignupSendCodeResult,
} from '../../models/auth/signup/handlers/by-email-start/send-code';
import {
  resetEmailPasswordModel,
  ResetEmailPasswordArgs,
  ResetEmailPasswordResult,
} from '../../models/auth/reset-email-password';
import { setCookieFastify } from '../../libs/firebase/auth/set-cookie-fastify';
import { toHttpException } from '../../libs/errors';
import { AuthByLogin } from '../../models/auth/login/types';
import { SignupData, SignupDataEnd } from '../../models/auth/signup/types';
import { MessageResponseDto, SuccessMessageResponseDto } from '../../dto/common.dto';
import {
  LoginByEmailDto,
  LoginResponseDto,
  SignupByEmailEndDto,
  SignupByEmailEndResponseDto,
  SignupByEmailStartDto,
  ResetEmailPasswordDto,
} from './dto';

@ApiTags('auth')
@Controller('api')
@UseGuards(ThrottlerGuard)
export class AuthController {
  // POST /api/auth/login/byEmail — вход по email
  // Лимит ужесточён против перебора паролей (5 запросов/мин на IP).
  // eslint-disable-next-line class-methods-use-this
  @Post('/auth/login/byEmail')
  @ApiOperation({ summary: 'Вход по email', description: 'POST /api/auth/login/byEmail' })
  @ApiBody({ type: LoginByEmailDto })
  @ApiResponse({ status: 200, description: 'Успешный вход (устанавливает session cookie)', type: LoginResponseDto })
  @ApiResponse({ status: 400, description: 'Неверные учётные данные' })
  @ApiResponse({ status: 429, description: 'Превышен лимит запросов' })
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async loginByEmail(@Body() body: { authByLogin: AuthByLogin }, @Res() reply: FastifyReply): Promise<FastifyReply> {
    try {
      const args: LoginArgs = { authByLogin: body.authByLogin };
      const result: LoginResult = await loginModel(args);

      // Установить сессионную cookie через Fastify
      await setCookieFastify(reply, result.userCredential, result.user, 'login');

      return reply.send({ user: result.user, company: result.company, message: result.message });
    } catch (err: unknown) {
      throw toHttpException(err);
    }
  }

  // POST /api/auth/signup/byEmailStart — начало регистрации
  // eslint-disable-next-line class-methods-use-this
  @Post('/auth/signup/byEmailStart')
  @ApiOperation({ summary: 'Начало регистрации по email', description: 'POST /api/auth/signup/byEmailStart' })
  @ApiBody({ type: SignupByEmailStartDto })
  @ApiResponse({ status: 200, description: 'Код подтверждения отправлен', type: MessageResponseDto })
  @HttpCode(200)
  async signupByEmailStart(@Body() body: { signupData: SignupData }): Promise<SignupByEmailStartResult> {
    try {
      const args: SignupByEmailStartArgs = { signupData: body.signupData };
      return await signupByEmailStartModel(args);
    } catch (err: unknown) {
      throw toHttpException(err);
    }
  }

  // POST /api/auth/signup/sendCodeAgain — повторная отправка кода
  // eslint-disable-next-line class-methods-use-this
  @Post('/auth/signup/sendCodeAgain')
  @ApiOperation({ summary: 'Повторная отправка кода', description: 'POST /api/auth/signup/sendCodeAgain' })
  @ApiBody({ type: SignupByEmailStartDto })
  @ApiResponse({ status: 200, description: 'Код отправлен повторно', type: MessageResponseDto })
  @HttpCode(200)
  async signupSendCodeAgain(@Body() body: { signupData: SignupData }): Promise<SignupSendCodeResult> {
    try {
      const args: SignupSendCodeArgs = { signupData: body.signupData };
      return await signupSendCodeModel(args);
    } catch (err: unknown) {
      throw toHttpException(err);
    }
  }

  // POST /api/auth/signup/byEmailEnd — завершение регистрации
  // eslint-disable-next-line class-methods-use-this
  @Post('/auth/signup/byEmailEnd')
  @ApiOperation({ summary: 'Завершение регистрации', description: 'POST /api/auth/signup/byEmailEnd' })
  @ApiBody({ type: SignupByEmailEndDto })
  @ApiResponse({
    status: 200,
    description: 'Регистрация завершена (устанавливает session cookie)',
    type: SignupByEmailEndResponseDto,
  })
  @HttpCode(200)
  async signupByEmailEnd(
    @Body() body: { signupDataEnd: SignupDataEnd },
    @Res() reply: FastifyReply,
  ): Promise<FastifyReply> {
    try {
      const args: SignupByEmailEndArgs = { signupDataEnd: body.signupDataEnd };
      const result: SignupByEmailEndResult = await signupByEmailEndModel(args);

      // Установить сессионную cookie через Fastify
      await setCookieFastify(reply, result.userCredential, result.newUserData, 'signup');

      return reply.send({
        newUserData: result.newUserData,
        newCompanyData: result.newCompanyData,
        message: result.message,
      });
    } catch (err: unknown) {
      throw toHttpException(err);
    }
  }

  // POST /api/auth/login/resetEmailPassword — сброс пароля
  // Лимит ужесточён против спама ссылками восстановления (3 запроса/мин на IP).
  // eslint-disable-next-line class-methods-use-this
  @Post('/auth/login/resetEmailPassword')
  @ApiOperation({ summary: 'Сброс пароля', description: 'POST /api/auth/login/resetEmailPassword' })
  @ApiBody({ type: ResetEmailPasswordDto })
  @ApiResponse({ status: 200, description: 'Ссылка восстановления отправлена', type: SuccessMessageResponseDto })
  @ApiResponse({ status: 400, description: 'Не удалось отправить ссылку' })
  @HttpCode(200)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async resetEmailPassword(@Body() body: { email: string }): Promise<ResetEmailPasswordResult> {
    try {
      const args: ResetEmailPasswordArgs = { email: body.email };
      const result = await resetEmailPasswordModel(args);
      // Модель возвращает success: false, когда не удалось отправить письмо.
      // Кидаем ошибку в едином формате (statusCode + body), как это делают модели,
      // чтобы общий catch корректно отдал 400 (HttpException не имеет поля statusCode).
      if (!result.success) {
        throw Object.assign(new Error('Не удалось отправить ссылку'), {
          statusCode: HttpStatus.BAD_REQUEST,
          body: result,
        });
      }
      return result;
    } catch (err: unknown) {
      throw toHttpException(err);
    }
  }
}
