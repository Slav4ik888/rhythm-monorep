import { SignupData } from '../types';
import { createNewCompanyData } from '../utils';
import { creatorFixDate } from '../../../base';
import { DbRef, getRefCol, getRefDoc } from '../../../helpers';
import { Company } from '../../../company';


interface CreateNewCompany {
  newCompanyData : Company
  companyId      : string
}

/** Create new User data without CompanyId */
export const createNewCompany = async (data: SignupData, userId: string): Promise<CreateNewCompany> => {
   const newCompanyData = createNewCompanyData(data);

  newCompanyData.owner   = data.email;
  newCompanyData.ownerId = userId;

  const
    companyRef  = await getRefCol(DbRef.COMPANIES).add(newCompanyData),
    // companySnap = await companyRef.get(),
    // company     = companySnap.data() as Company,
    companyId   = companyRef.id;
  
  newCompanyData.id         = companyId;
  newCompanyData.createdAt  = creatorFixDate(userId);
  newCompanyData.lastChange = creatorFixDate(userId);

  
  // Complection company
  await getRefDoc(DbRef.COMPANY, { companyId }).update({
    id         : newCompanyData.id,
    createdAt  : newCompanyData.createdAt,
    lastChange : newCompanyData.lastChange
  });


  return {
    newCompanyData,
    companyId
  }
};
