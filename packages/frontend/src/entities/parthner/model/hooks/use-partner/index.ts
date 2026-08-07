import { useCallback, useMemo, useState } from 'react';
import { useAppDispatch, useInitialEffect } from 'shared/lib/hooks';
import { useSearchParams } from 'react-router-dom';
import { LS } from 'shared/lib/local-storage';
import { isValidPartnerId } from '../../../lib/utils';
import { increasePartnerFollower } from 'features/partner';



// https://rhy.thm.su/demo/?ref=slav4ik888

export const usePartner = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [hasIncreasedFollowers, setHasIncreasedFollowers] = useState(false);
  const partnerIdParams = searchParams.get('ref');
  const partnerIdLS = LS.getPartnerId();


  // Увеличение счётчика прошедших по ссылке
  const increaseFollowers = useCallback(() => {
    if (! partnerIdParams || hasIncreasedFollowers) return

    // Проверяем, что партнер новый
    if (partnerIdLS || ! isValidPartnerId(partnerIdParams)) return

    LS.setPartnerId(partnerIdParams);
    dispatch(increasePartnerFollower({ partnerId: partnerIdParams })); // Увеличиваем счётчик партнёра
    setHasIncreasedFollowers(true);
  },
    [partnerIdLS, partnerIdParams, hasIncreasedFollowers, dispatch]
  );

  useInitialEffect(() => {
    increaseFollowers();
  });


  // const api = useMemo(() => ({
  //   serviceIncreasePartnerFollower : (partnerId: string | null) => dispatch(increasePartnerFollower(partnerId)),
  // }),
  //   [dispatch]
  // );


  return {
    partnerIdParams,
    partnerIdLS,
    // ...api
  }
};
