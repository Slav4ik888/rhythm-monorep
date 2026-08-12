import { db } from '../../../../libs/firebase';
import { DbRef, getRefCol, getRefDoc } from '../../../helpers';
import { convertToDot } from '../../../../shared/utils/objects';
import { FieldValue } from 'firebase-admin/firestore';
import { DeleteTemplate } from '../../handlers/delete';

/**
 * Delete Temlate from DB.
 * Рефакторинг: убрана зависимость от Koa ctx — принимает явные аргументы.
 */
export const serviceDashboardDeleteTemlate = async (args: DeleteTemplate): Promise<DeleteTemplate> => {
  const { templateId, bunchId, bunchUpdatedMs } = args;

  // Get a new write batch
  const batch = db.batch();

  const ref = getRefDoc(DbRef.TEMPLATE, { bunchId });

  const updateObject = {
    [templateId]: FieldValue.delete(),
  };

  batch.update(ref, updateObject);

  // Update bunchUpdated
  const refCol = getRefCol(DbRef.TEMPLATES).doc('bunchesUpdated');
  batch.update(refCol, convertToDot({ [bunchId]: bunchUpdatedMs }));

  // Commit the batch
  await batch.commit();

  return args;
};
