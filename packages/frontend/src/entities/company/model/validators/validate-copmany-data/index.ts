import { PartialCompany } from '../../../types';
import { SCHEMA_NAME, validate, Validation } from 'shared/lib/validators';


export const validateCompanyData = (data: PartialCompany): Validation => validate(SCHEMA_NAME.COMPANY, data);
