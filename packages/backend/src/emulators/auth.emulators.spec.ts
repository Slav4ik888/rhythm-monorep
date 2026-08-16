// packages/backend/src/emulators/auth.emulators.spec.ts
// «Реальные» сценарии входа/регистрации против Firebase Auth/Firestore/Redis-эмуляторов.
//
// Запуск (эмуляторы должны быть подняты и засижены):
//   docker compose up -d
//   npm run seed:emulators -w packages/backend
//   npm run test:emulators -w packages/backend
//
// Обычный `npm test` эти тесты НЕ запускает (см. testPathIgnorePatterns в jest.config.ts).

import { loginModel } from '../models/auth/login';
import { signupByEmailStartModel } from '../models/auth/signup/handlers/by-email-start';
import { signupByEmailEndModel } from '../models/auth/signup/handlers/by-email-end';
import { redisGetSignup } from '../libs/redis';
import { client } from '../libs/redis/init';
import { admin } from '../libs/firebase';
import { serviceFindUserByEmail } from '../models/user';
import { serviceGetCompany } from '../models/company';
import { SignupData } from '../models/auth/signup/types';

// Значения seed-скрипта (seed-emulators.ts) — согласованы через env, чтобы тест
// не зависел от переопределённых переменных.
const SEED_EMAIL = process.env.SEED_EMAIL || 'owner@rhythm.test';
const SEED_PASSWORD = process.env.SEED_PASSWORD || 'Password123!';
const SEED_COMPANY_NAME = process.env.SEED_COMPANY_NAME || 'ООО «Эмулятор»';
const SEED_COMPANY_ID = process.env.SEED_COMPANY_ID || 'seed-company-001';

// Анти-спам защита signup: между запросом кода и ответом должно пройти ≥ 5 сек
// (SIGNUP_CODE_ANSWER_DELAY). Ждём чуть больше.
const ANSWER_DELAY_MS = 5200;

/** Дожидается готовности Redis (клиент подключается асинхронно при импорте libs/redis). */
async function waitForRedis(timeoutMs = 5000): Promise<void> {
  const start = Date.now();
  while (!client.isReady && Date.now() - start < timeoutMs) {
    // eslint-disable-next-line no-await-in-loop
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 50);
    });
  }
  if (!client.isReady) {
    throw new Error('Redis не доступен: запусти docker compose up -d');
  }
}

// Запускаем только явно через `npm run test:emulators` (RUN_EMULATOR_TESTS=1).
// Иначе describe.skip — чтобы прямой запуск конфига без эмуляторов не падал.
const describeAuth = process.env.RUN_EMULATOR_TESTS === '1' ? describe : describe.skip;

describeAuth('Auth против эмуляторов Firebase', () => {
  beforeAll(async () => {
    await waitForRedis();
  });

  // Закрываем сетевые соединения, чтобы Jest завершался без open handles.
  afterAll(async () => {
    await client.quit();
    await admin.app().delete();
  });

  describe('Вход (seed-пользователь)', () => {
    it('входит с корректными учётными данными и возвращает пользователя и компанию', async () => {
      const result = await loginModel({
        authByLogin: { email: SEED_EMAIL, password: SEED_PASSWORD },
      });

      expect(result.user.email).toBe(SEED_EMAIL);
      expect(result.user.companyId).toBe(SEED_COMPANY_ID);
      expect(result.company.companyName).toBe(SEED_COMPANY_NAME);
    });

    it('возвращает ошибку при неверном пароле', async () => {
      // Auth-эмулятор отдаёт auth/wrong-password (в боевом client SDK — auth/invalid-credential).
      await expect(
        loginModel({ authByLogin: { email: SEED_EMAIL, password: 'wrong-password' } }),
      ).rejects.toMatchObject({ code: 'auth/wrong-password' });
    });
  });

  describe('Регистрация (новый пользователь)', () => {
    const email = `new-${Date.now()}@rhythm.test`;
    const password = 'Password123!';
    const companyName = 'ООО «Новичок»';

    const signupData: SignupData = {
      companyName,
      firstName: 'Иван',
      secondName: 'Иванов',
      email,
      password,
      confirmPassword: password,
      // Схема требует строку (type: string), фронтенд шлёт '' при отсутствии реферера.
      partnerId: '',
      permissions: true,
      isMobile: false,
    };

    it('полный цикл: byEmailStart → код из Redis → byEmailEnd → вход', async () => {
      const start = await signupByEmailStartModel({ signupData });
      expect(start.message).toContain(email);

      // Код подтверждения уходит по email (в тесте — StubTransport), а хранится в Redis.
      const { code } = await redisGetSignup(email);
      expect(code).toBeTruthy();

      // Анти-спам: между запросом и ответом должно пройти ≥ 5 сек.
      await new Promise<void>((resolve) => {
        setTimeout(resolve, ANSWER_DELAY_MS);
      });

      const end = await signupByEmailEndModel({ signupDataEnd: { email, emailCode: code } });
      expect(end.newUserData.email).toBe(email);
      expect(end.newCompanyData.companyName).toBe(companyName);

      // Пользователь и компания реально сохранены в Firestore-эмуляторе.
      const savedUser = await serviceFindUserByEmail(email);
      expect(savedUser).toBeTruthy();
      expect(savedUser.id).toBe(end.newUserData.id);
      expect(savedUser.companyId).toBe(end.newCompanyData.id);

      const savedCompany = await serviceGetCompany(end.newCompanyData.id);
      expect(savedCompany?.companyName).toBe(companyName);

      // После регистрации можно войти.
      const login = await loginModel({ authByLogin: { email, password } });
      expect(login.user.email).toBe(email);
      expect(login.company.id).toBe(end.newCompanyData.id);
    });
  });
});
