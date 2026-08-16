import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase Admin SDK (Service Account).
// В production креды читаются из JSON-файла сервисного аккаунта, путь к которому
// задаёт systemd через GOOGLE_APPLICATION_CREDENTIALS (см. rhythm-server.service).
// Так privateKey не зависит от того, как systemd/dotenv трактуют `\n` (systemd
// в EnvironmentFile съедает обратный слэш, из-за чего ключ портился).
// Локально (dev/test) креды берутся из переменных окружения FIREBASE_* через dotenv.
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  admin.initializeApp();
} else {
  admin.initializeApp({
    // projectId задаём явно: иначе Admin SDK берёт его из GOOGLE_CLOUD_PROJECT/метаданных,
    // и в Auth-эмуляторе пользователи попадают в другой тенант (projectId undefined),
    // чем у client SDK (FIREBASE_PROJECT_ID) — вход по email ломается (auth/user-not-found).
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID || '',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export { admin, db };
