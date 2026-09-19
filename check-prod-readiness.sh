#!/usr/bin/env bash
#
# check-prod-readiness.sh — проверка готовности продакшена «Ритм».
#
# Запускать на боевом сервере от root (нужен доступ к /etc/rhythm/, systemctl, nginx):
#   bash check-prod-readiness.sh
#
# Проверяет ключевые пункты из README.dev.md (раздел «Проверки перед публикацией в прод»):
#   1. Секреты /etc/rhythm/ (rhythm-server.env + firebase-adminsdk.json)
#   2. LOGS_PASS задан и не пуст
#   3. Redis доступен
#   4. systemd-юнит установлен и активен
#   5. Nginx-конфиг валиден
#   6. Напоминание о Firebase rules (Firestore/Storage должны быть закрыты)
#
# Скрипт только читает состояние (ничего не меняет). Выход с кодом 1, если хотя бы одна
# критичная проверка не пройдена ([FAIL]); предупреждения ([WARN]) на код выхода не влияют.

set -u

# --- Пути (совпадают с rhythm-server.service и README.dev.md) ---
SECRETS_DIR="/etc/rhythm"
ENV_FILE="$SECRETS_DIR/rhythm-server.env"
ADMINSDK_FILE="$SECRETS_DIR/firebase-adminsdk.json"
REPO_DIR="/var/www/vtempe/data/rhythm2"
SYSTEMD_UNIT="/etc/systemd/system/rhythm-server.service"
SERVICE_NAME="rhythm-server"
NGINX_SITE="/etc/nginx/sites-enabled/rhy.thm.su"

# Счётчики результатов
PASSED=0
FAILED=0
WARNED=0

# Цвета вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok()   { echo -e "${GREEN}[ OK ]${NC} $1"; PASSED=$((PASSED + 1)); }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; WARNED=$((WARNED + 1)); }
fail() { echo -e "${RED}[FAIL]${NC} $1"; FAILED=$((FAILED + 1)); }

section() {
  echo
  echo "=== $1 ==="
}

# Права файла в восьмеричном виде (Linux: stat -c, macOS-фолбэк: stat -f — для локального прогона).
file_perm() {
  stat -c '%a' "$1" 2>/dev/null || stat -f '%Lp' "$1" 2>/dev/null
}

echo "Проверка готовности продакшена «Ритм»"
echo "Дата: $(date '+%Y-%m-%d %H:%M:%S')"

# ---------------------------------------------------------------------------
section "1. Секреты /etc/rhythm/"

if [ -d "$SECRETS_DIR" ]; then
  ok "Каталог $SECRETS_DIR существует"
else
  fail "Каталог $SECRETS_DIR не найден — создай и положи секреты (README.dev.md → Деплой)"
fi

if [ -f "$ENV_FILE" ]; then
  ok "$ENV_FILE существует"
  perm=$(file_perm "$ENV_FILE")
  if [ "$perm" = "600" ] || [ "$perm" = "400" ]; then
    ok "$ENV_FILE права $perm (только root)"
  else
    warn "$ENV_FILE права '$perm' — рекомендуется 600 (root:root)"
  fi
else
  fail "$ENV_FILE не найден (шаблон: packages/backend/.env.example)"
fi

if [ -f "$ADMINSDK_FILE" ]; then
  ok "$ADMINSDK_FILE существует"
  perm=$(file_perm "$ADMINSDK_FILE")
  if [ "$perm" = "600" ] || [ "$perm" = "400" ]; then
    ok "$ADMINSDK_FILE права $perm (только root)"
  else
    warn "$ADMINSDK_FILE права '$perm' — рекомендуется 600 (root:root)"
  fi
  if command -v node >/dev/null 2>&1; then
    if node -e '
      const fs = require("fs");
      const j = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
      if (!j.project_id || !j.client_email || !j.private_key) process.exit(1);
    ' "$ADMINSDK_FILE" 2>/dev/null; then
      ok "$ADMINSDK_FILE — валидный JSON с project_id/client_email/private_key"
    else
      fail "$ADMINSDK_FILE — невалидный JSON или нет полей project_id/client_email/private_key"
    fi
  else
    warn "node не найден — пропускаю проверку JSON"
  fi
else
  fail "$ADMINSDK_FILE не найден — Admin SDK не сможет инициализироваться в production"
fi

# ---------------------------------------------------------------------------
section "2. LOGS_PASS (пароль доступа к /loggers/*)"

if [ -f "$ENV_FILE" ]; then
  # systemd EnvironmentFile: строка `LOGS_PASS=value` без export.
  pass_line=$(grep -E '^LOGS_PASS=' "$ENV_FILE" 2>/dev/null | head -n 1)
  if [ -n "$pass_line" ]; then
    pass_value="${pass_line#LOGS_PASS=}"
    # Убираем возможные обёрточные кавычки.
    pass_value="${pass_value%\"}"; pass_value="${pass_value#\"}"
    pass_value="${pass_value%\'}"; pass_value="${pass_value#\'}"
    if [ -n "$pass_value" ]; then
      ok "LOGS_PASS задан (длина ${#pass_value} симв.)"
    else
      fail "LOGS_PASS пуст — эндпоинты /loggers/* остаются с пустым паролем"
    fi
  else
    fail "LOGS_PASS отсутствует в $ENV_FILE"
  fi
else
  fail "Не могу проверить LOGS_PASS: $ENV_FILE не найден"
fi

# ---------------------------------------------------------------------------
section "3. Redis"

if command -v redis-cli >/dev/null 2>&1; then
  pong=$(redis-cli ping 2>/dev/null)
  if [ "$pong" = "PONG" ]; then
    ok "Redis отвечает (PONG)"
  else
    fail "Redis не отвечает (redis-cli ping → '$pong')"
  fi
else
  warn "redis-cli не найден — проверь вручную: redis-cli ping"
fi

# ---------------------------------------------------------------------------
section "4. systemd-юнит ($SERVICE_NAME)"

if [ -f "$SYSTEMD_UNIT" ]; then
  ok "$SYSTEMD_UNIT существует"
else
  fail "$SYSTEMD_UNIT не найден — выполни deploy.sh (sync_service_file) или скопируй packages/backend/rhythm-server.service"
fi

if command -v systemctl >/dev/null 2>&1; then
  active=$(systemctl is-active "$SERVICE_NAME" 2>/dev/null)
  if [ "$active" = "active" ]; then
    ok "Сервис $SERVICE_NAME активен"
  else
    fail "Сервис $SERVICE_NAME не активен (status: ${active:-unknown})"
  fi
else
  warn "systemctl не найден — пропускаю проверку"
fi

# ---------------------------------------------------------------------------
section "5. Nginx"

if command -v nginx >/dev/null 2>&1; then
  if nginx -t >/dev/null 2>&1; then
    ok "nginx -t — конфиг валиден"
  else
    fail "nginx -t завершился с ошибкой"
  fi
else
  warn "nginx не найден — пропускаю проверку"
fi

if [ -f "$NGINX_SITE" ] || [ -L "$NGINX_SITE" ]; then
  ok "$NGINX_SITE существует (источник: packages/backend/rhy.thm.su)"
else
  warn "$NGINX_SITE не найден — проверь symlink в sites-enabled/ (или панель ISPmanager)"
fi

# ---------------------------------------------------------------------------
section "6. Firebase rules (Firestore/Storage закрыты)"

if [ -f "$REPO_DIR/firestore.rules" ]; then
  ok "$REPO_DIR/firestore.rules существует"
else
  warn "$REPO_DIR/firestore.rules не найден"
fi

if [ -f "$REPO_DIR/storage.rules" ]; then
  ok "$REPO_DIR/storage.rules существует"
else
  warn "$REPO_DIR/storage.rules не найден"
fi

warn "Проверь, что боевые правила закрыты: выполни на машине с firebase CLI"
warn "  firebase deploy --only firestore:rules,storage:rules"
warn "и/или убедись в Firebase Console (project rhythm-g2d7), что Firestore и Storage"
warn "стоят в режиме «закрыто» (allow read, write: if false). Firestore доступен только"
warn "через бэкенд (Admin SDK), прямых клиентских обращений нет."

# ---------------------------------------------------------------------------
echo
echo "=== Итог ==="
echo -e "${GREEN}Пройдено: $PASSED${NC}   ${RED}Ошибок: $FAILED${NC}   ${YELLOW}Предупреждений: $WARNED${NC}"

if [ "$FAILED" -gt 0 ]; then
  echo -e "${RED}Найдены критические проблемы — устрани их перед публикацией в прод.${NC}"
  exit 1
fi

echo -e "${GREEN}Все критические проверки пройдены.${NC}"
exit 0

