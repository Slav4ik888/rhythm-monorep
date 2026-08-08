// packages/backend/src/models/google/services/get-data/index.ts

import axios from 'axios';

// Таймаут 4 минуты — чуть меньше, чем nginx proxy_read_timeout (5 мин),
// чтобы бэкенд успел вернуть осмысленную ошибку, а не 504 от nginx
const GOOGLE_GET_TIMEOUT = 1000 * 60 * 4;

export async function serviceGoogleGetData(url: string): Promise<string | undefined> {
  const response = await axios.get(url, { timeout: GOOGLE_GET_TIMEOUT });

  return response.data;
}
