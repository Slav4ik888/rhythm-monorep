// packages/backend/src/models/templates/services/update/tests/update.test.ts

import { serviceUpdateTemplate } from '../index';
import { getRefDoc, getRefCol } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { db } from '../../../../../libs/firebase';
import { createMockColRef, createMockDocRef } from '../../../../tests/mocks/firestore';
import { createMockTemplate } from '../../../mocks';

// Мокаем помощники работы с Firestore; DbRef берём из реального (чистого) модуля types.
jest.mock('../../../../helpers', () => ({
  ...jest.requireActual('../../../../helpers/types'),
  getRefDoc: jest.fn(),
  getRefCol: jest.fn(),
}));
// Мокаем firebase целиком, чтобы не инициализировать Admin SDK в тестах.
jest.mock('../../../../../libs/firebase', () => ({ db: { batch: jest.fn() }, admin: {}, auth: {} }));

const getRefDocMock = getRefDoc as jest.Mock;
const getRefColMock = getRefCol as jest.Mock;
const dbBatchMock = db.batch as jest.Mock;

const batch = {
  set: jest.fn(),
  update: jest.fn(),
  commit: jest.fn().mockResolvedValue(undefined),
};

describe('serviceUpdateTemplate', () => {
  beforeEach(() => {
    dbBatchMock.mockReturnValue(batch);
    batch.set.mockClear();
    batch.update.mockClear();
    batch.commit.mockClear();
  });

  it('при bunchAction=create создаёт шаблон через batch.set и обновляет bunchesUpdated', async () => {
    const template = createMockTemplate({ id: 'template-1', bunchId: 'bunch-1' });
    const templateRef = createMockDocRef();
    const bunchesUpdatedDoc = createMockDocRef();
    const colRef = createMockColRef({ doc: jest.fn().mockReturnValue(bunchesUpdatedDoc) });

    getRefDocMock.mockReturnValue(templateRef);
    getRefColMock.mockReturnValue(colRef);

    const res = await serviceUpdateTemplate({
      template,
      bunchUpdatedMs: 123,
      bunchAction: 'create',
      userId: 'user-1',
    });

    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.TEMPLATE, { bunchId: 'bunch-1' });
    expect(getRefColMock).toHaveBeenCalledWith(DbRef.TEMPLATES);
    expect(colRef.doc).toHaveBeenCalledWith('bunchesUpdated');

    expect(batch.set).toHaveBeenCalledTimes(1);
    expect(batch.set).toHaveBeenCalledWith(
      templateRef,
      expect.objectContaining({
        'template-1': expect.objectContaining({
          id: 'template-1',
          bunchId: 'bunch-1',
          createdAt: { userId: 'user-1', date: expect.any(Number) },
          lastChange: { userId: 'user-1', date: expect.any(Number) },
        }),
      }),
    );

    expect(batch.update).toHaveBeenCalledTimes(1);
    expect(batch.update).toHaveBeenCalledWith(bunchesUpdatedDoc, { 'bunch-1': 123 });
    expect(batch.commit).toHaveBeenCalledTimes(1);

    expect(res).toEqual({
      bunchUpdatedMs: 123,
      bunchAction: 'create',
      template: expect.objectContaining({
        id: 'template-1',
        lastChange: { userId: 'user-1', date: expect.any(Number) },
      }),
    });
  });

  it('при bunchAction=update и fullSet=false обновляет шаблон через convertToDot', async () => {
    const template = createMockTemplate({ id: 'template-1', bunchId: 'bunch-1' });
    const templateRef = createMockDocRef();
    const bunchesUpdatedDoc = createMockDocRef();
    const colRef = createMockColRef({ doc: jest.fn().mockReturnValue(bunchesUpdatedDoc) });

    getRefDocMock.mockReturnValue(templateRef);
    getRefColMock.mockReturnValue(colRef);

    await serviceUpdateTemplate({
      template,
      bunchUpdatedMs: 123,
      bunchAction: 'update',
      userId: 'user-1',
    });

    expect(batch.set).not.toHaveBeenCalled();
    // template (convertToDot) + bunchesUpdated
    expect(batch.update).toHaveBeenCalledTimes(2);
    expect(batch.update).toHaveBeenCalledWith(
      templateRef,
      expect.objectContaining({
        'template-1.id': 'template-1',
        'template-1.lastChange.userId': 'user-1',
        'template-1.lastChange.date': expect.any(Number),
      }),
    );
    expect(batch.update).toHaveBeenCalledWith(bunchesUpdatedDoc, { 'bunch-1': 123 });
    expect(batch.commit).toHaveBeenCalledTimes(1);
  });

  it('при fullSet=true перезаписывает шаблон целиком без convertToDot', async () => {
    const template = createMockTemplate({ id: 'template-1', bunchId: 'bunch-1' });
    const templateRef = createMockDocRef();
    const bunchesUpdatedDoc = createMockDocRef();
    const colRef = createMockColRef({ doc: jest.fn().mockReturnValue(bunchesUpdatedDoc) });

    getRefDocMock.mockReturnValue(templateRef);
    getRefColMock.mockReturnValue(colRef);

    await serviceUpdateTemplate({
      template,
      bunchUpdatedMs: 123,
      bunchAction: 'update',
      fullSet: true,
      userId: 'user-1',
    });

    expect(batch.set).not.toHaveBeenCalled();
    expect(batch.update).toHaveBeenCalledWith(
      templateRef,
      expect.objectContaining({
        'template-1': expect.objectContaining({
          id: 'template-1',
          lastChange: { userId: 'user-1', date: expect.any(Number) },
        }),
      }),
    );
    expect(batch.update).toHaveBeenCalledWith(bunchesUpdatedDoc, { 'bunch-1': 123 });
  });
});
