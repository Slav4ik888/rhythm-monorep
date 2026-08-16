# Firebase Emulator Suite (Auth + Firestore + Storage) — официальные эмуляторы Google.
# Используется для локальных «реальных» сценариев входа/регистрации (см. PLAN.md —
# этап «Отложено (блокировано окружением)»).

# Базовый образ с Java 21 (firebase-tools ≥14 требует JDK 21+ для Firestore-эмулятора).
FROM eclipse-temurin:21-jre-jammy

# Node.js 20 LTS (нужен для firebase-tools).
RUN apt-get update \
  && apt-get install -y --no-install-recommends curl ca-certificates \
  && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y --no-install-recommends nodejs \
  && rm -rf /var/lib/apt/lists/*

# Последняя стабильная версия firebase-tools (CLI Emulator Suite).
RUN npm install -g firebase-tools

WORKDIR /firebase

# Порты: UI 4000, Firestore 8080, Auth 9099, Storage 9199.
EXPOSE 4000 8080 9099 9199

# projectId ДОЛЖЕН совпадать с FIREBASE_PROJECT_ID (packages/backend/.env.example),
# иначе client SDK и Admin SDK попадают в разные тенанты Auth-эмулятора и вход ломается
# (auth/user-not-found). rhythm-g2d7 — реальный projectId боевого Firebase.
CMD ["firebase", "emulators:start", "--project", "rhythm-g2d7", "--only", "auth,firestore,storage"]
