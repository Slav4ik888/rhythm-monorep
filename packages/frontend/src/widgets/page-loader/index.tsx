import { FC, memo } from 'react';
import { useUI } from 'entities/ui';
import { PageLoaderContainer } from './container';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { isEmpty, isNotEmpty } from 'shared/helpers/objects';



type Props = {
  loading? : boolean
  text?    : string
}

/**
 * v.2025-07-06
 * Center block loader with text message
 */
export const PageLoader: FC<Props> = memo(({ loading, text }) => {
  const { pageLoading } = useUI();

  if (isEmpty(pageLoading) && ! loading) return null;

  return (
    <PageLoaderContainer
      loading = {isNotEmpty(pageLoading)}
      text    = {text}
    />
  )
});
