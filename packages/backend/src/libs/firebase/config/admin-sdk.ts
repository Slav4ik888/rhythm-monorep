import admin from 'firebase-admin';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase Admin SDK (Service Account).
// Секреты вынесены в переменные окружения, чтобы не хранить их в репозитории
// (см. README — раздел «Переменные окружения»).
// privateKey приходит с литеральными `\n` — приводим их к реальным переносам строк.
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export { admin, db };
