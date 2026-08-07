import { Errors } from '../../../libs/validators';
import { isNoEmptyFields } from '../../../shared/utils/objects';
import { ERR_CODE } from '../err-code';
import { getErrorMessage } from '../get-error-message';



type Result = Errors & {
  message? : string
}


export const getErrors = (errors: Errors): Result => {
  if (! errors) return { general: getErrorMessage(ERR_CODE.General) };

  const isNotEmpty = isNoEmptyFields(errors);
  let result: Result = {};
  console.log('[ResponseError][getErrors] isNotEmpty:', isNotEmpty);

  // switch (err.status) {
  //   case 401: return ERR_CODE['auth/id-token-expired'];
  // }
  // if (errObj) return errObj

  switch (errors.code as any) {
    case 1009:
      result = { general: getErrorMessage(ERR_CODE.MaxFileSize) };
      break;

    case ERR_CODE['auth/email-already-exists']:
    case ERR_CODE['auth/email-already-in-use']:
      result = { email: getErrorMessage(ERR_CODE[errors.code]) };
      break;

    case ERR_CODE['auth/id-token-expired']:
    case ERR_CODE['auth/user-not-found']:
    case ERR_CODE['auth/invalid-login-credentials']:
    case ERR_CODE['auth/invalid-credential']:
      result = { general: getErrorMessage(ERR_CODE[errors.code]) };
      break;

    case ERR_CODE['auth/wrong-password']:
      result = { password: getErrorMessage(ERR_CODE[errors.code]) };
      break;

    default:
      if (errors.code) {
        result = { general: `[${errors?.code}]: ${errors?.message}` };
      }
      else if (isNotEmpty) {
        result = { ...errors };
      }
      else result = {
        general: getErrorMessage(ERR_CODE.General),
        unknownError: 'true' // Если неизвестная ошибка, нужно её всю залогировать
      };

  }

  if (errors.message) result.message = getErrorMessage(ERR_CODE[errors.message]);
  if (errors.code)    result.code    = errors.code;

  return result
}
