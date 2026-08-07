import { useAppDispatch } from 'shared/lib/hooks';
import { useMemo } from 'react';
import { getData } from '../../services';
import { ReqGetGoogleData } from 'shared/types';



export const useDashboardGetData = () => {
  const dispatch = useAppDispatch();

  const api = useMemo(() => ({
    serviceGetData    : (data: ReqGetGoogleData) => dispatch(getData(data)),
  }),
    [dispatch]
  );


  return {
    ...api,
  }
};
