import { signupByEmailStartController as signupByEmailStart } from './signup/by-email-start'
import { signupSendCodeController as signupSendCode } from './signup/send-code-again'
import { signupByEmailEndController as signupByEmailEnd } from './signup/by-email-end'
import { loginController as login } from './login'
import { resetEmailPasswordController as resetEmailPassword } from './reset-email-password'


export default {
  signupByEmailStart,
  signupSendCode,
  signupByEmailEnd,
  resetEmailPassword,
  login,
}
