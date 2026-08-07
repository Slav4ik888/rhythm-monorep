import { Errors } from 'shared/lib/validators';
import { Company, ParamsCompany } from '../../types/company';



export interface StateSchemaCompany {
  company                  : Company // TODO: Возможно deprecated, сейчас только для первоначальных данных при getAuth
  storedCompany            : ParamsCompany
  paramsCompany            : ParamsCompany
  loading                  : boolean
  errors                   : Errors
  _isParamsCompanyIdLoaded : boolean // Загрузка по paramsCompanyId, чтобы не загружать повторно (в бесконечном цикле)
}
