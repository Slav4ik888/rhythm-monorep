import {
  getRandomNumber,
  getRandomNumbers,
  getRandomEngLitera,
  getRandomPasswordChar,
  getRandomLetters,
  getRandom3Letters,
  getRandom5Letters,
  getRandom10Letters,
  getRandom20Letters,
  getRandom28Letters,
  getRandomElement,
  getRandomBoolean,
  getMixedArray,
} from '..';

describe('random helpers', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getRandomNumber', () => {
    it('возвращает min при Math.random() = 0', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      expect(getRandomNumber(5, 10)).toBe(5);
    });

    it('возвращает max при Math.random() близко к 1', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.9999);
      expect(getRandomNumber(5, 10)).toBe(10);
    });

    it('возвращает целое число в пределах диапазона', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.5);
      const result = getRandomNumber(3, 9);
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(3);
      expect(result).toBeLessThanOrEqual(9);
    });
  });

  describe('getRandomNumbers', () => {
    it('возвращает пустую строку для length < 1', () => {
      expect(getRandomNumbers(0)).toBe('');
      expect(getRandomNumbers(-1)).toBe('');
    });

    it('возвращает строку заданной длины из цифр', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      expect(getRandomNumbers(5)).toBe('00000');
    });
  });

  describe('getRandomEngLitera', () => {
    it('возвращает "a" при Math.random() = 0', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      expect(getRandomEngLitera()).toBe('a');
    });

    it('возвращает "z" при Math.random() близко к 1', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.9999);
      expect(getRandomEngLitera()).toBe('z');
    });
  });

  describe('getRandomPasswordChar', () => {
    it('возвращает "a" при Math.random() = 0', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      expect(getRandomPasswordChar()).toBe('a');
    });

    it('возвращает последний символ алфавита при Math.random() близко к 1', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.9999);
      expect(getRandomPasswordChar()).toBe('*');
    });
  });

  describe('getRandomLetters', () => {
    it('возвращает пустую строку для n = 0', () => {
      expect(getRandomLetters(0)).toBe('');
    });

    it('возвращает строку из n букв', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      expect(getRandomLetters(4)).toBe('aaaa');
    });

    it('генераторы фиксированной длины возвращают корректную длину', () => {
      expect(getRandom3Letters()).toHaveLength(3);
      expect(getRandom5Letters()).toHaveLength(5);
      expect(getRandom10Letters()).toHaveLength(10);
      expect(getRandom20Letters()).toHaveLength(20);
      expect(getRandom28Letters()).toHaveLength(28);
    });
  });

  describe('getRandomElement', () => {
    it('возвращает первый элемент при Math.random() = 0', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      expect(getRandomElement([10, 20, 30])).toBe(10);
    });

    it('возвращает элемент из массива', () => {
      const arr = ['a', 'b', 'c'];
      expect(arr).toContain(getRandomElement(arr));
    });
  });

  describe('getRandomBoolean', () => {
    it('возвращает false при Math.random() = 0', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);
      expect(getRandomBoolean()).toBe(false);
    });

    it('возвращает true при Math.random() = 0.9', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.9);
      expect(getRandomBoolean()).toBe(true);
    });
  });

  describe('getMixedArray', () => {
    it('возвращает массив той же длины с теми же элементами', () => {
      const input = [1, 2, 3, 4, 5];
      const result = getMixedArray([...input]);
      expect(result).toHaveLength(input.length);
      expect([...result].sort()).toEqual([...input].sort());
    });

    it('возвращает пустой массив для пустого входного', () => {
      expect(getMixedArray([])).toEqual([]);
    });

    it('не мутирует исходный массив', () => {
      const input = [1, 2, 3, 4, 5];
      const copy = [...input];
      getMixedArray(input);
      expect(input).toEqual(copy);
    });
  });
});
