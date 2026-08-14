import 'regenerator-runtime/runtime';
import { generateKeyPairSync } from 'crypto';

// Заглушки секретов для тестов.
// firebase-admin при импорте (libs/firebase/config/admin-sdk.ts → cert()) валидирует privateKey
// через node-forge, поэтому в тестах без реальных секретов подставляем сгенерированный валидный ключ.
// Генерируем на лету, чтобы не хранить в репозитории даже тестовый PEM.
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
