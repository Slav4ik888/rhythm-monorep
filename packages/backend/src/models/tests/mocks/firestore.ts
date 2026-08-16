// packages/backend/src/models/tests/mocks/firestore.ts
// Общие моки Firestore-референсов для unit-тестов сервисов models/*/services.
// Сервисы работают с Firestore через getRefCol/getRefDoc (эти помощники мокаются
// в конкретных тестах через jest.mock). Фабрики ниже возвращают объекты,
// имитирующие CollectionReference / DocumentReference firebase-admin.

export interface MockDocRef {
  id: string;
  update: jest.Mock;
  set: jest.Mock;
  get: jest.Mock;
  delete: jest.Mock;
}

export interface MockColRef {
  add: jest.Mock;
  doc: jest.Mock;
  where: jest.Mock;
  orderBy: jest.Mock;
  limit: jest.Mock;
  get: jest.Mock;
}

/** Мок Query (результат collectionGroup/where/orderBy/limit). */
export interface MockQueryRef {
  where: jest.Mock;
  orderBy: jest.Mock;
  limit: jest.Mock;
  get: jest.Mock;
}

/** Мок DocumentReference (результат getRefDoc). */
export const createMockDocRef = (overrides: Partial<MockDocRef> = {}): MockDocRef => ({
  id: 'mock-doc-id',
  update: jest.fn().mockResolvedValue(undefined),
  set: jest.fn().mockResolvedValue(undefined),
  get: jest.fn().mockResolvedValue({ data: () => undefined, exists: true }),
  delete: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

/** Мок CollectionReference (результат getRefCol). */
export const createMockColRef = (overrides: Partial<MockColRef> = {}): MockColRef => {
  const ref: MockColRef = {
    add: jest.fn(),
    doc: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    get: jest.fn(),
  };

  const result = { ...ref, ...overrides };

  if (!overrides.add) result.add.mockResolvedValue(createMockDocRef());
  if (!overrides.doc) result.doc.mockImplementation(() => createMockDocRef());
  if (!overrides.get) result.get.mockResolvedValue({ docs: [], size: 0, empty: true });

  // Цепочка where/orderBy/limit должна возвращать финальный объект (с overrides),
  // иначе `.where(...).get()` теряет переопределённый get.
  result.where.mockReturnValue(result);
  result.orderBy.mockReturnValue(result);
  result.limit.mockReturnValue(result);

  return result;
};

/** Мок Query (цепочка collectionGroup().where().limit().get()). */
export const createMockCollectionGroup = (overrides: Partial<MockQueryRef> = {}): MockQueryRef => {
  const query: MockQueryRef = {
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    get: jest.fn(),
  };

  const result = { ...query, ...overrides };

  if (!overrides.get) result.get.mockResolvedValue({ docs: [], size: 0, empty: true });

  // Цепочка where/orderBy/limit должна возвращать финальный объект (с overrides),
  // иначе `.where(...).limit(...).get()` теряет переопределённый get.
  result.where.mockReturnValue(result);
  result.orderBy.mockReturnValue(result);
  result.limit.mockReturnValue(result);

  return result;
};
