import { Errors } from '../../../libs/validators';
import { ERR_CODE } from '../err-code';


export const getStatus = (errors: Errors): number => {
  if (! errors) return 500;

  if (errors.status) return errors.status as unknown as number;
  if (errors.statusCode) return errors.statusCode as unknown as number;

  switch (errors.code as any) {
    case 1009: // MaxFileSize
    case ERR_CODE['auth/email-already-exists']:
    case ERR_CODE['auth/email-already-in-use']:
      return 400

    case ERR_CODE['auth/id-token-expired']:
    case ERR_CODE['auth/user-not-found']:
    case ERR_CODE['auth/invalid-login-credentials']:
    case ERR_CODE['auth/invalid-credential']:
    case ERR_CODE['auth/wrong-password']:
      return 401

    default: return 500;
  }
}
