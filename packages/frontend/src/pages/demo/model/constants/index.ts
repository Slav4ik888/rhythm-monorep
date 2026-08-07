
export interface DemoPageType {
  id       : number
  route    : string
  title    : string
  alt      : string
  caption  : string
}

export const DEMO_PAGES: DemoPageType[] = [
  {
    id       : 1,
    route    : '/demoPecarColor_JlY5D/dashboard',
    title    : 'Яркая панель',
    alt      : 'Демо-картинка компании "Семейный пекарь" (цветной вариант)',
    caption  : 'Цветовая палитра, в соответствии с "Оргсхемой из 7 отделений" Л.Рона Хаббарда.',
  },
  {
    id       : 2,
    route    : '/demoPecarLight_sP4kL/dashboard',
    title    : 'Светлосерая панель',
    alt      : 'Демо-картинка компании "Семейный пекарь" (светлый вариант)',
    caption  : 'Присутствует график с индивидуальной настройкой периода. ',
  }
];
