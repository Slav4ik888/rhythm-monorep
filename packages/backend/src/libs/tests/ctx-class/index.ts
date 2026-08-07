import { Errors } from '../../validators';


/** For tests when throw error */
export class CtxClass {
  status : number = 200
  errors : Errors = {}
  fn     : Function

  constructor (fn: Function) {
    this.fn = fn
  }

  throw(status: number, errors: Errors) {
    this.status = status;
    this.errors = errors;
    this.fn();
  }
};
