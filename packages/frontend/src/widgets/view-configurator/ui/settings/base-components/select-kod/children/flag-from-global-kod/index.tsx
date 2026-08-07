import { FC, memo } from 'react';
import { FlagByScheme } from '../../../../../base-features-components';



interface Props {
  scheme: string
}

export const FlagFromGlobalKod: FC<Props> = memo(({ scheme }) => (
  <FlagByScheme
    scheme       = {scheme}
    title        = 'fromGlobalKod'
    // eslint-disable-next-line max-len
    toolTitle    = {`"fromGlobalKod" - если true, то kod будет автоматически подтягиваться от ближайшего parent
 у которых стоит галка (isGlobalKod)`}
  />
));
