import * as s from '../../selectors';
import { actions as a } from '../../slice';
// import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/lib/hooks';
import { Errors } from 'shared/lib/validators';
import { RequestTransactions } from '../../types';
import { sendTransactions } from 'features/transactions';


// interface Config {

// }

// export const useTransactions = (config: Config = {}) => {
//   const
//     { } = config,
export const useTransactions = () => {
  const
    dispatch = useAppDispatch(),

    // loading     = useSelector(s.selectLoading),
    // errors      = useSelector(s.selectErrors),
    setErrors   = (errors: Errors) => dispatch(a.setErrors(errors)),
    clearErrors = () => dispatch(a.setErrors({})),


    serviceSendTransactions = (request: RequestTransactions) => dispatch(sendTransactions(request));


  return {
    // loading,
    // errors,
    setErrors,
    clearErrors,

    serviceSendTransactions
  }
};
