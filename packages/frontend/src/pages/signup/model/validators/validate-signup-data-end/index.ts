import { SignupDataEnd } from '../..';
import { SCHEMA_NAME, validate, Validation } from 'shared/lib/validators';


export const validateSignupDataEnd = (data: SignupDataEnd): Validation => validate(SCHEMA_NAME.SIGNUP_DATA_END, data);
