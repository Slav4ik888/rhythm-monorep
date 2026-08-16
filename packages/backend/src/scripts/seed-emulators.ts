// packages/backend/src/scripts/seed-emulators.ts
// Seed-скрипт: наполняет эмуляторы Firebase (Auth + Firestore) тестовыми данными.
// Запуск: npm run seed:emulators -w packages/backend   (предварительно docker compose up -d)
//
// Создаёт владельца компании (owner@rhythm.test) с активной компанией, чтобы сценарий
// «входа» можно было прогнать против реального Auth-эмулятора. Сценарий «регистрации»
// создаёт пользователя/компанию на лету и в сидах не нуждается.

// Важно: переменные окружения (секреты из .env + адреса эмуляторов из npm-скрипта
// seed:emulators) должны быть в process.env ДО импорта libs/firebase (admin-sdk читает
// FIRESTORE_EMULATOR_HOST / FIREBASE_AUTH_EMULATOR_HOST на этапе getFirestore()).
import '../config/load-env';
import { admin, db } from '../libs/firebase';
import { creatorFixDate } from '../models/base';
import { Role, UserStatus } from '../models/user/types';
import { CompanyStatus } from '../models/company/types';

const EMAIL = process.env.SEED_EMAIL || 'owner@rhythm.test';
const PASSWORD = process.env.SEED_PASSWORD || 'Password123!';
const COMPANY_NAME = process.env.SEED_COMPANY_NAME || 'ООО «Эмулятор»';
// Детерминированный id компании, чтобы seed можно было перезапускать без «осиротевших» документов.
const COMPANY_ID = process.env.SEED_COMPANY_ID || 'seed-company-001';
const OWNER_NAME = process.env.SEED_OWNER_NAME || 'Иван';

async function seed() {
  // Защита от случайного запуска против боевого Firebase: сиды должны работать
  // только с эмуляторами (иначе зальём тестовые данные в прод).
  if (!process.env.FIRESTORE_EMULATOR_HOST || !process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    throw new Error(
      'Отказано: FIRESTORE_EMULATOR_HOST / FIREBASE_AUTH_EMULATOR_HOST не заданы. ' +
        'Запусти эмуляторы (docker compose up -d) и используй npm run seed:emulators ' +
        '(адреса эмуляторов задаются инлайн в npm-скрипте).',
    );
  }

  // Идемпотентность: используем существующего пользователя, если он уже создан.
  let userRecord: admin.auth.UserRecord;
  try {
    userRecord = await admin.auth().getUserByEmail(EMAIL);
    console.log(`[seed] Пользователь ${EMAIL} уже существует (uid=${userRecord.uid})`);
  } catch {
    userRecord = await admin.auth().createUser({
      email: EMAIL,
      password: PASSWORD,
      emailVerified: true,
    });
    console.log(`[seed] Создан пользователь ${EMAIL} (uid=${userRecord.uid})`);
  }

  const userId = userRecord.uid;

  // Компания (коллекция companies/{companyId}) — структура совпадает с creatorCompany.
  await db
    .collection('companies')
    .doc(COMPANY_ID)
    .set({
      id: COMPANY_ID,
      companyName: COMPANY_NAME,
      ownerId: userId,
      owner: EMAIL,
      logoUrl: '',
      status: CompanyStatus.ACTIVE,
      companyMembers: [],
      createdAt: creatorFixDate(userId),
      lastChange: creatorFixDate(userId),
      googleData: { url: '' },
      customSettings: {},
      bunchesUpdated: {},
      sheets: {},
      dashboardMembers: [],
      dashboardPublicAccess: {},
    });

  // Пользователь (коллекция users/{companyId}/users/{userId}) — структура совпадает с creatorUser.
  await db
    .collection('users')
    .doc(COMPANY_ID)
    .collection('users')
    .doc(userId)
    .set({
      id: userId,
      companyId: COMPANY_ID,
      person: {
        displayName: OWNER_NAME,
        avatarUrl: '',
        phoneNumber: '',
        fio: { firstName: OWNER_NAME, secondName: '', middleName: '' },
      },
      email: EMAIL,
      permissions: true,
      role: Role.OWNER,
      emailVerified: true,
      status: UserStatus.ACTIVE,
      order: 100,
      settings: {},
      partner: { partnerId: '', referrerId: '' },
      isEditAccess: false,
      createdAt: creatorFixDate(userId),
      lastChange: creatorFixDate(userId),
    });

  console.log('[seed] Готово.');
  console.log(`[seed] email: ${EMAIL}`);
  console.log(`[seed] password: ${PASSWORD}`);
  console.log(`[seed] companyId: ${COMPANY_ID}`);
  console.log(`[seed] userId: ${userId}`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed] Ошибка:', err);
    process.exit(1);
  });
