import { Errors } from 'shared/lib/validators';

export type DocKey = 'policy' // Политика конфиденциальности


export type DocKeys = Record<DocKey, string>

export interface StateSchemaDocs {
  loading : boolean
  errors  : Errors
  docKeys : DocKeys
}
