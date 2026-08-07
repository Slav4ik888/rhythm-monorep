import { SignupData } from '../..';
import { SCHEMA_NAME, validate, Validation } from 'shared/lib/validators';


export const validateSignupData = (data: SignupData): Validation => validate(SCHEMA_NAME.SIGNUP_DATA, data);
