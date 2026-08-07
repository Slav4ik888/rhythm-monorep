import * as s from '../../selectors';
import { actions } from '../../slice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/lib/hooks';
import { getPolicy } from '../../../../../features/docs/get-policy/model/services';
import { Errors } from 'shared/lib/validators';



export const useDocs = () => {
  const
    dispatch = useAppDispatch(),

    loading        = useSelector(s.selectLoading),
    errors         = useSelector(s.selectErrors),
    setErrors      = (err: Errors) => dispatch(actions.setErrors(err)),
    clearErrors    = () => dispatch(actions.clearErrors()),

    docs           = useSelector(s.selectDocs),
    policy         = useSelector(s.selectPolicy),

    serviceGetPolicy     = () => dispatch(getPolicy());


  return {
    loading,
    errors,
    setErrors,
    clearErrors,

    docs,
    policy,

    serviceGetPolicy
  }
};
