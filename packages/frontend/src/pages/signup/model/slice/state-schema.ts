import { Errors } from 'shared/lib/validators';
import { SignupData } from '../types';



export interface StateSchemaSignupPage {
  loading    : boolean
  errors     : Errors
  signupData : SignupData
  codeSended : boolean
}
