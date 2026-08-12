#!/bin/bash

set -e # Остановить выполнение при любой ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Флаги
FRONT_ONLY=false

# Путь к монорепозиторию на сервере (один репозиторий: frontend + backend + shared)
REPO_DIR="/var/www/vtempe/data/rhythm2"

log() {
  echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
  echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
  exit 1
}

warning() {
  echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Функция для выполнения команды с проверкой
run_command() {
  log "Выполняю: $1"
  if eval "$1"; then
    log "✅ Успешно: $1"
  else
    error "❌ Ошибка при выполнении: $1"
  fi
}

# Функция для показа помощи
show_help() {
  echo "Использование: $0 [OPTIONS]"
  echo ""
  echo "OPTIONS:"
  echo "  -frontOnly    Запустить только сборку фронтенд части"
  echo "  -h, --help    Показать это сообщение помощи"
  echo ""
  echo "Примеры:"
  echo "  $0              # Полный деплой (бэкенд + фронтенд)"
  echo "  $0 -frontOnly   # Только сборка фронтенда"
}

# Функция для обработки аргументов командной строки
parse_arguments() {
  while [[ $# -gt 0 ]]; do
    case $1 in
      -frontOnly)
        FRONT_ONLY=true
        shift
        ;;
      -h|--help)
        show_help
        exit 0
        ;;
      *)
        error "Неизвестный параметр: $1"
        ;;
    esac
  done
}

# Функция сборки бэкенда (NestJS → packages/backend/server/)
build_backend() {
  log "🔧 Сборка бэкенда..."
  run_command "cd $REPO_DIR && npm run build -w packages/backend"
}

# Функция сборки фронтенда (Vite → packages/frontend/build/)
build_frontend() {
  log "🎨 Сборка фронтенда..."
  run_command "cd $REPO_DIR && npm run build -w packages/frontend"
}

# Функция перезапуска сервиса
restart_service() {
  log "🔄 Перезапуск сервиса..."
  run_command "service rhythm-server restart"
}

# Полный деплой
full_deploy() {
  log "🚀 Запуск полного процесса деплоя..."
  run_command "cd $REPO_DIR"
  run_command "git pull"
  build_backend
  build_frontend
  restart_service
}

# Деплой только фронтенда
frontend_only_deploy() {
  log "🎨 Запуск деплоя только фронтенд части..."
  run_command "cd $REPO_DIR"
  run_command "git pull"
  build_frontend
  log "ℹ️  Фронтенд собран, но сервис не перезапускался (требуется только при изменениях бэкенда)"
}

# Основной процесс
main() {
  parse_arguments "$@"
  
  if [ "$FRONT_ONLY" = true ]; then
    frontend_only_deploy
  else
    full_deploy
  fi
  
  log "🎉 Деплой успешно завершен!"
}

# Запускаем основной процесс
main "$@"


# Сделайте скрипт исполняемым и запустите:
# chmod +x deploy.sh
# $REPO_DIR/packages/frontend/deploy.sh
# $REPO_DIR/packages/frontend/deploy.sh -frontOnly
