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

  ref.add.mockResolvedValue(createMockDocRef());
  ref.doc.mockImplementation(() => createMockDocRef());
  ref.where.mockReturnValue(ref);
  ref.orderBy.mockReturnValue(ref);
  ref.limit.mockReturnValue(ref);
  ref.get.mockResolvedValue({ docs: [], size: 0, empty: true });

  return { ...ref, ...overrides };
};
