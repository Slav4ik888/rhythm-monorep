import { Context } from '../../../../app/types/global';
import { db } from '../../../../libs/firebase';
import { DbRef, getRefDoc } from '../../../helpers';
import { ViewItem } from '../../types';


// Разовая help function для создания новой коллекции bunches Firestore
// Сохраняем имеющиеся ViewItems в новую коллекцию bunches Firestore
export async function devSaveBunches(ctx: Context) {
  const { bunches, companyId } = ctx.request.body as { bunches: ViewItem[], companyId: string };

  if (! bunches || ! companyId) return

  // Get a new write batch
  const batch = db.batch();

  // Для каждой грозди в массиве
  for (const bunch of bunches) {
    // Получаем bunchId из первого элемента грозди
    const bunchId = Object.values(bunch)[0].bunchId;
    const ref = getRefDoc(DbRef.BUNCH, { companyId, bunchId });
    batch.set(ref, bunch);
  }

  // Commit the batch
  await batch.commit();
}
