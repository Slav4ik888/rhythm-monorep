import { creatorFixDate } from '../../../base';
import { DbRef, getRefDoc } from '../../../helpers';
import { FieldValue } from 'firebase-admin/firestore';



/** Delete sheet in DB */
export const serviceCompanyDeleteSheet = async (
  companyId : string,
  sheetId   : string,
  userId    : string
): Promise<undefined> => {

  await getRefDoc(DbRef.COMPANY, { companyId }).update({
    [`sheets.${sheetId}`] : FieldValue.delete(),
    lastChange            : creatorFixDate(userId)
  });

  return
};
