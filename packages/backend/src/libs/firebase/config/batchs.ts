import { admin } from './admin-sdk';
import { DocumentData, DocumentReference, CollectionReference } from 'firebase/firebase-firestore';

export async function deleteCollection(
  db: admin.firestore.Firestore,
  collectionPath1: string,
  userId: string,
  collectionPath2: string,
  batchSize: number,
) {
  let collectionRef: CollectionReference<DocumentData> | DocumentReference<DocumentData>;

  if (collectionPath2) collectionRef = db.collection(collectionPath1).doc(userId).collection(collectionPath2);
  else collectionRef = db.collection(collectionPath1);

  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(
  db: admin.firestore.Firestore,
  query: CollectionReference<DocumentData> | DocumentReference<DocumentData>,
  resolve: (v?: unknown) => void,
) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}
