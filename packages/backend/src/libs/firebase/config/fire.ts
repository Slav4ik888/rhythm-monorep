import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Web-конфиг Firebase (client SDK). Значения вынесены в переменные окружения
// (см. README — раздел «Переменные окружения»).
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || '',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Подключение к Auth-эмулятору (docker compose up -d → localhost:9099).
// Admin SDK подхватывает FIREBASE_AUTH_EMULATOR_HOST автоматически, а client SDK —
// нет. Без connectAuthEmulator signInWithEmailAndPassword / createUserWithEmailAndPassword
// ходили бы в боевой Firebase вместо эмулятора.
if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  const authEmulatorUrl = `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`;
  connectAuthEmulator(auth, authEmulatorUrl, { disableWarnings: true });
}
