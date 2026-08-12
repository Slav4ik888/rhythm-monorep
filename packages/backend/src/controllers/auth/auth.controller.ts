// packages/backend/src/controllers/auth/auth.controller.ts
// NestJS-контроллер для auth (миграция с Koa)
// Заменяет controllers/auth/login, signup, reset-email-password

import { Controller, Post, Body, HttpException, HttpStatus, HttpCode, Res } from '@nestjs/common';
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
import { AuthByLogin } from '../../models/auth/login/types';
import { SignupData, SignupDataEnd } from '../../models/auth/signup/types';

@Controller('api')
export class AuthController {
  // POST /api/auth/login/byEmail — вход по email
  // eslint-disable-next-line class-methods-use-this
  @Post('/auth/login/byEmail')
  @HttpCode(200)
  async loginByEmail(@Body() body: { authByLogin: AuthByLogin }, @Res() reply: FastifyReply): Promise<any> {
    try {
      const args: LoginArgs = { authByLogin: body.authByLogin };
      const result: LoginResult = await loginModel(args);

      // Установить сессионную cookie через Fastify
      await setCookieFastify(reply, result.userCredential, result.user, 'login');

      return reply.send({ user: result.user, company: result.company, message: result.message });
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // POST /api/auth/signup/byEmailStart — начало регистрации
  // eslint-disable-next-line class-methods-use-this
  @Post('/auth/signup/byEmailStart')
  @HttpCode(200)
  async signupByEmailStart(@Body() body: { signupData: SignupData }): Promise<SignupByEmailStartResult> {
    try {
      const args: SignupByEmailStartArgs = { signupData: body.signupData };
      return await signupByEmailStartModel(args);
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // POST /api/auth/signup/sendCodeAgain — повторная отправка кода
  // eslint-disable-next-line class-methods-use-this
  @Post('/auth/signup/sendCodeAgain')
  @HttpCode(200)
  async signupSendCodeAgain(@Body() body: { signupData: SignupData }): Promise<SignupSendCodeResult> {
    try {
      const args: SignupSendCodeArgs = { signupData: body.signupData };
      return await signupSendCodeModel(args);
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // POST /api/auth/signup/byEmailEnd — завершение регистрации
  // eslint-disable-next-line class-methods-use-this
  @Post('/auth/signup/byEmailEnd')
  @HttpCode(200)
  async signupByEmailEnd(@Body() body: { signupDataEnd: SignupDataEnd }, @Res() reply: FastifyReply): Promise<any> {
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
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // POST /api/auth/login/resetEmailPassword — сброс пароля
  // eslint-disable-next-line class-methods-use-this
  @Post('/auth/login/resetEmailPassword')
  @HttpCode(200)
  async resetEmailPassword(@Body() body: { email: string }): Promise<ResetEmailPasswordResult> {
    try {
      const args: ResetEmailPasswordArgs = { email: body.email };
      const result = await resetEmailPasswordModel(args);
      if (!result.success) {
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      }
      return result;
    } catch (err: any) {
      if (err.statusCode) {
        throw new HttpException(err.body || err.message, err.statusCode);
      }
      throw new HttpException({ general: err.message || 'Internal server error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
