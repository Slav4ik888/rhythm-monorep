// packages/frontend/src/pages/policy/ui/index.tsx

import { FC, memo } from 'react';
import { ShowPolicyText } from 'features/docs/get-policy';
import { LayoutInnerPage } from 'shared/ui/pages';

const PolicyPage: FC = memo(() => (
  <LayoutInnerPage type='policy' containerType='md'>
    <ShowPolicyText />
  </LayoutInnerPage>
));

export default PolicyPage;
