import { db } from '../../../libs/firebase';
import { DocumentData, CollectionReference } from 'firebase/firebase-firestore';
import { DbRef } from '../types';



interface Data {
  userId?     : string
  companyId?  : string
  parentId?   : string
  documentId? : string
}


/** Ref */
export const getRefCol = (type: DbRef, data: Data = {}): CollectionReference<DocumentData> => {
  const { userId, companyId, parentId, documentId } = data;

  switch (type) {
    case DbRef.COMPANIES: return db.collection(DbRef.COMPANIES);
    case DbRef.BUNCHES:   return db.collection(DbRef.BUNCHES)  .doc(companyId).collection(DbRef.BUNCHES);
    case DbRef.TEMPLATES: return db.collection(DbRef.TEMPLATES);

    // DEPRECATED
    case DbRef.VIEWS:     return db.collection(DbRef.VIEWS)    .doc(companyId).collection(DbRef.VIEWS);

    default: return null
  }
}
