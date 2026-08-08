// _for-me-not-for-ai/optimized-google-apps-script.js

// Оптимизированный скрипт для Google Apps Script
// Заменяет текущий doGet() в проекте Apps Script

const ss = SpreadsheetApp.getActiveSpreadsheet();

const SHEET_NAME_WEEK = 'Filtred_week';
const SHEET_NAME_WEEK_RANGE = 'A:FA'; // диапазон ячеек
const SHEET_NAME_MONTH = 'Filtred_month';
const SHEET_NAME_MONTH_RANGE = 'A:FA';

// Кэш на 2 минуты (максимум для CacheService — 6 часов)
const CACHE_TTL_SECONDS = 120;

/**
 * Получает данные листа с кэшированием.
 * Использует getDataRange() вместо getRange('A:FA') — не тянет пустые колонки.
 */
function getData(sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  const lastRow = sheet.getLastRow();
  if (lastRow === 0) return [];

  // getDataRange() — только непустой диапазон, быстрее чем getRange('A:FA')
  const range = sheet.getDataRange();
  const values = range.getValues();

  // Обрезаем до lastRow (getDataRange может захватить пустые строки в конце)
  return values.slice(0, lastRow);
}

/**
 * Основной обработчик GET-запроса.
 * Кэширует результат через CacheService для быстрых повторных запросов.
 */
function doGet() {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'google_sheets_data';

  // Пробуем взять из кэша
  const cached = cache.get(cacheKey);
  if (cached) {
    return ContentService
      .createTextOutput(cached)
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Формируем данные
  const data = JSON.stringify({
    weekData: getData(SHEET_NAME_WEEK) || [],
    monthData: getData(SHEET_NAME_MONTH) || [],
  });

  // Кладём в кэш
  cache.put(cacheKey, data, CACHE_TTL_SECONDS);

  return ContentService
    .createTextOutput(data)
    .setMimeType(ContentService.MimeType.JSON);
}
