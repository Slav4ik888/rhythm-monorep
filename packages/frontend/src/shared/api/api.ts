import cfg from 'app/config';
import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  timeout: 1000 * 60 * 5, //  Увеличил до 5х минут чтобы с гугл успевало прогрузиться, иногда задерживается
  withCredentials: true, // Если с куки,
  headers: {
    'X-Client-Version': cfg.VERSION,
  },
});

// Бэкенд (CheckVersionInterceptor) отвечает 409 Conflict с updateRequired, если версия клиента
// устарела (заголовок X-Client-Version не совпал с версией на сервере). Сбрасываем кэш Service Worker
// и перезагружаем страницу, чтобы гарантированно подтянулся свежий бандл.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 409 && error?.response?.data?.updateRequired) {
      const lastReload = Number(sessionStorage.getItem('vcheck-reload') || 0);
      // Защита от зацикливания: не чаще одного reload в 3 секунды
      if (Date.now() - lastReload > 3000) {
        sessionStorage.setItem('vcheck-reload', String(Date.now()));

        // Снять регистрацию SW и очистить его кэш, чтобы reload взял свежий index.html из сети
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((reg) => reg.unregister()));
        }
        if (window.caches) {
          window.caches.keys().then((keys) => keys.forEach((key) => window.caches.delete(key)));
        }

        window.location.reload();
      }
    }
    return Promise.reject(error);
  },
);

// Для загрузки с гугл таблиц
// export const apiWithoutCookie = axios.create({
//   baseURL : '/api',
//   timeout : 1000 * 30,
// });

// const onSuccess = (response) => response;
// const onFail = (err) => {
//   if (err.response.status === 401) {
//     log(`Обработал ошибку 401`);
//     return {data: null};
//   }
//   return err;
// };

// api.interceptors.response.use(onSuccess, onFail);
