import { Errors } from 'shared/lib/validators';
import type { SignupData } from '../types';



export interface StateSchemaSignupPage {
  loading    : boolean
  errors     : Errors
  signupData : SignupData
  codeSended : boolean
}
