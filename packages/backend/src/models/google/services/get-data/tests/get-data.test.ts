// packages/backend/src/models/google/services/get-data/tests/get-data.test.ts

import axios from 'axios';
import { serviceGoogleGetData } from '../index';

// Мокаем axios целиком — сервис делает только axios.get(url, { timeout }).
jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

// Таймаут, зашитый в сервис (4 минуты — чуть меньше nginx proxy_read_timeout).
const GOOGLE_GET_TIMEOUT = 1000 * 60 * 4;

describe('serviceGoogleGetData', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  it('вызывает axios.get с url и таймаутом 4 минуты', async () => {
    mockedAxios.get.mockResolvedValue({ data: 'csv-data' });

    await serviceGoogleGetData('https://script.google.com/exec?key=1');

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith('https://script.google.com/exec?key=1', {
      timeout: GOOGLE_GET_TIMEOUT,
    });
  });

  it('возвращает data из ответа axios', async () => {
    mockedAxios.get.mockResolvedValue({ data: 'col1,col2\n1,2' });

    const res = await serviceGoogleGetData('https://script.google.com/exec?key=2');

    expect(res).toBe('col1,col2\n1,2');
  });

  it('возвращает undefined, если в ответе нет data', async () => {
    mockedAxios.get.mockResolvedValue({ data: undefined });

    const res = await serviceGoogleGetData('https://script.google.com/exec?key=3');

    expect(res).toBeUndefined();
  });

  it('пробрасывает ошибку от axios без изменений', async () => {
    const error = new Error('network error');
    mockedAxios.get.mockRejectedValue(error);

    await expect(serviceGoogleGetData('https://script.google.com/exec?key=4')).rejects.toThrow('network error');
  });
});
