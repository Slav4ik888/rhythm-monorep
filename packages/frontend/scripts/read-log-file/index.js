/* eslint-disable @typescript-eslint/no-require-imports */
// const fs = require('fs');
// const readline = require('readline');
const fs = require('fs').promises;
const path = require('path');


const getValue = (strArr, value) => {
  const index = strArr.findIndex(item => item === value);
  return strArr[index + 1];
};


// node . errors.log
async function readLogFileAsync(filePath) {
  try {
    let countDemo = 0; // Счетчик подходящих строк
    let countPartners = 0;

    const data = await fs.readFile(filePath, 'utf8');
    const lines = data.split(/\r?\n/);
    // console.log('lines.length: ', lines.length);

    lines.forEach(str => {
      if (str.trim()) { // Пропускаем пустые строки
        const lineArr = str.split(' ');
        const path = getValue(lineArr, '[r]:'); // /api/increaseFollower
        const ref = getValue(lineArr, '[ref]:');
        const user = getValue(lineArr, '[u]:');

        if (ref.includes('demo') && user === 'quest') {
          if (!['/api/increaseFollower', '/api/getData'].includes(path)) { // Это дублирующие строки
            console.log(str);
            countDemo++;
          }
        }
        else {
          // console.log('------------', ref.includes('demo'), ' -- ', user, user === 'quest');
        }

        if (path === '/api/increaseFollower') {
          countPartners++;
        }
        // if (path === '/api/getData') {
        //   if (ref.includes('demo') && user === 'quest') count++;
        //   const ci = getValue(lineArr, '[ci]:');
        //   console.log('ci: ', ci);

        //   if (ci.includes('demo')) {
        //     console.log('demo');
        //   }
        // }
      }
    });
    console.log('countDemo: ', countDemo, 'countPartners: ', countPartners);
  }
  catch (err) {
    console.error('Ошибка при чтении файла:', err);
  }
}

// Использование
// Получаем путь к файлу из аргументов командной строки
const filename = process.argv[2]; // || './errors.log';
const filePath = path.resolve(__dirname, filename);


if (!filePath) {
  console.log('Использование: node index.js <путь-к-файлу>');
  process.exit(1);
}
readLogFileAsync(filePath);

// Синхронно читайет файл целиком все строки и обрабатывает
// function readLogFileSync(filePath) {
//   try {
//     const data = fs.readFileSync(filePath, 'utf8');
//     const lines = data.split(/\r?\n/); // Разделяем на строки

//     lines.forEach((line, index) => {
//       console.log(`[${index + 1}] ${line}`); // Выводим с номером строки
//     });

//     console.log(`Всего строк: ${lines.length}`);
//   } catch (err) {
//     console.error('Ошибка при чтении файла:', err);
//   }
// }

// Читает длинный файл и выводит каждую строку
// function readLogFile(filePath) {
//   const fileStream = fs.createReadStream(filePath);

//   const rl = readline.createInterface({
//     input: fileStream,
//     crlfDelay: Infinity // Поддержка всех вариантов переноса строк
//   });

//   rl.on('line', (line) => {
//     console.log(line); // Выводим каждую строку
//   });

//   rl.on('close', () => {
//     console.log('Файл полностью прочитан');
//   });

//   rl.on('error', (err) => {
//     console.error('Ошибка при чтении файла:', err);
//   });
// }
