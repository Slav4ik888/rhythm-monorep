import { SCHEMA_NAME, validate, Validation } from 'shared/lib/validators';
import { AuthByLogin } from '../../services';


export const validateAuthByLogin = (data: AuthByLogin): Validation => validate(SCHEMA_NAME.AUTH_BY_LOGIN, data);
