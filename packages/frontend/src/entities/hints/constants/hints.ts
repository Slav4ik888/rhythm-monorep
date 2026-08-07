import { Hint } from '../types';


export const HINTS: Hint[] = [
  // Dashboard
  // Navbar
  {
    id        : 'control-date-end',
    title     : 'Конечная дата периода',
    text      : 'Выберите здесь дату, до которой нужно отображать данные.',
    attention : 'Через некоторое время (например, через неделю) Вы можете изменить эту дату,'
     + ' чтобы увидеть более актуальные данные.',
    isShown   : false,
    showAgain : true
  },
  {
    id        : 'control-refresh-btn',
    title     : 'Кнопка обновления данных',
    text      : 'Нажмите на неё, когда понадобится получить изменившиеся данные из google-таблицы.',
    isShown   : false,
    showAgain : true
  },
  {
    id        : 'last-updated-text',
    title     : 'Дата и время последного обновления',
    text      : 'Здесь показано, когда было последнее обновление данных из google-таблицы.',
    isShown   : false,
    showAgain : true
  },
  {
    id        : 'period-type',
    title     : 'Длительность периода',
    text      : 'Здесь можно выбрать длительность периода, за который будет отображаться статистика.',
    attention : 'Выбрав "Произвольный", Вы сможете настроить период вручную: указав начальную и конечную дату.',
    isShown   : false,
    showAgain : true
  },
  {
    id        : 'control-date-start',
    title     : 'Начальная дата периода',
    text      : 'Здесь можно выбратьначальную дату, после того, как длительность периода укажите "Произвольный"',
    isShown   : false,
    showAgain : true
  },
]
