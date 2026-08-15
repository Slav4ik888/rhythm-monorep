#!/usr/bin/env bash
# dev.sh — запуск dev-окружения «Ритм».
#
# Проблема, которую решает скрипт: при `npm run dev` фронтенд (Vite) стартует за ~150 мс
# и сразу шлёт первые запросы к API, а бэкенд (ts-node + NestJS + Firebase) ещё грузится.
# Из-за этого прокси Vite падал с ECONNREFUSED. Здесь бэкенд запускается первым,
# и фронтенд поднимается только после того, как порт 7575 начал слушаться.
set -euo pipefail

BACKEND_PORT="${BACKEND_PORT:-7575}"

BACKEND_PID=""

# Останавливаем фоновый бэкенд при выходе (Ctrl+C или завершение по любой причине).
cleanup() {
  if [[ -n "${BACKEND_PID}" ]]; then
    # npm (10+) пробрасывает сигнал дочернему nodemon → ts-node
    kill "${BACKEND_PID}" 2>/dev/null || true
    pkill -P "${BACKEND_PID}" 2>/dev/null || true
  fi
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

# 1. Бэкенд в фоне.
npm run dev -w packages/backend &
BACKEND_PID=$!

# 2. Ждём, пока бэкенд не начнёт слушать порт.
echo "⏳ Ожидание готовности бэкенда (порт ${BACKEND_PORT})..."
wait-on -t 90000 "tcp:${BACKEND_PORT}"

# 3. Фронтенд — в foreground (Ctrl+C остановит и его, и бэкенд через trap).
echo "✅ Бэкенд готов. Запускаю фронтенд..."
npm run dev -w packages/frontend
