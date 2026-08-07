import { Errors } from 'shared/lib/validators';


export interface StateSchemaLoginPage {
  loading          : boolean
  errors           : Errors
  resetEmailResult : boolean // Результат запроса на восстановление пароля, чтобы понять закрывать ли окошко запроса
}
