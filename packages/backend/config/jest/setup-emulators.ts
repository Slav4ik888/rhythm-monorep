// packages/backend/config/jest/setup-emulators.ts
// setupFiles для jest.config-emulators.ts: подгружает .env бэкенда ДО загрузки тестовых
// модулей, чтобы admin-sdk (getFirestore) и client SDK (connectAuthEmulator) увидели
// FIRESTORE_EMULATOR_HOST / FIREBASE_AUTH_EMULATOR_HOST и реальные секреты.

import 'regenerator-runtime/runtime';
import { config } from 'dotenv';
import { generateKeyPairSync } from 'crypto';
import { resolve } from 'path';

// Путь задаём явно, чтобы не зависеть от cwd, из которого запущен jest.
config({ path: resolve(__dirname, '..', '..', '.env') });

// Заглушки секретов (на случай, если .env не заполнен) — те же, что в setup-tests.ts.
// firebase-admin валидирует privateKey через node-forge, поэтому генерируем валидный PEM.
const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 1024 });
const dummyPrivateKey = privateKey.export({ type: 'pkcs1', format: 'pem' }) as string;

process.env.FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'test-project';
process.env.FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL || 'test@example.com';
process.env.FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY || dummyPrivateKey;

// Web-конфиг Firebase (client SDK) — заглушки, чтобы initializeApp() не падал при импорте.
process.env.FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || 'test-api-key';
process.env.FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN || 'test.firebaseapp.com';
process.env.FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET || 'test.appspot.com';
process.env.FIREBASE_MESSAGING_SENDER_ID = process.env.FIREBASE_MESSAGING_SENDER_ID || '123456789';
process.env.FIREBASE_APP_ID = process.env.FIREBASE_APP_ID || '1:123456789:web:test';

// SMTP — заглушки (в тестах используется StubTransport, реальная отправка не происходит).
process.env.SMTP_USER = process.env.SMTP_USER || 'test@example.com';
process.env.SMTP_PASS = process.env.SMTP_PASS || 'test';

// Логи — заглушка пароля доступа к /loggers/*.
process.env.LOGS_PASS = process.env.LOGS_PASS || 'test-pass';

// Адреса эмуляторов (совпадают с docker-compose.yml). Задаём явно, чтобы эмуляторные
// тесты не зависели от .env (обычный `npm run dev` должен ходить в боевой Firebase).
process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || 'localhost:9099';
