// PARTNER_IDS
export const PARTNER_IDS = [
  'slav4ik888',
  'dima',       // Дмитрий ЦСС
  'rodion',     // Родион ЦСС
  'azbuka',     // Александр Непомнящий
  'oleg',       // Олег Казанцев Бизнес-практикум Молдова
];


// Сгенерить код
function generateRandomDigits() {
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

// console.log(generateRandomDigits());
