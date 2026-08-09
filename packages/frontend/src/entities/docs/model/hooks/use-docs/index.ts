// packages/frontend/src/entities/docs/model/hooks/use-docs/index.ts

import { useDocsStore } from '../../store';
import { Errors } from 'shared/lib/validators';
import { getPolicy } from '../../../../../features/docs/get-policy/model/services';

export const useDocs = () => {
  const loading = useDocsStore((s) => s.loading),
    errors = useDocsStore((s) => s.errors),
    docs = useDocsStore((s) => s.docKeys),
    policy = useDocsStore((s) => s.docKeys?.policy || ''),
    setErrors = (err: Errors) => useDocsStore.getState().setErrors(err),
    clearErrors = () => useDocsStore.getState().clearErrors(),
    serviceGetPolicy = async () => {
      useDocsStore.getState().startLoading();
      try {
        const result = await getPolicy();
        useDocsStore.getState().setDocKey('policy', result);
        useDocsStore.getState().finishLoading();
      } catch (e) {
        useDocsStore.getState().setErrors({ general: 'Error in features/docs/getPolicy' });
        useDocsStore.getState().finishLoading();
      }
    };

  return {
    loading,
    errors,
    setErrors,
    clearErrors,

    docs,
    policy,

    serviceGetPolicy,
  };
};
