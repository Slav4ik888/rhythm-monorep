import { FC, memo } from 'react';
import { ShowPolicyText } from 'features/docs/get-policy';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components';
import { reducerDocs } from 'entities/docs';
import { LayoutInnerPage } from 'shared/ui/pages';



const initialReducers: ReducersList = {
  docs: reducerDocs
};


const PolicyPage: FC = memo(() => (
    <DynamicModuleLoader reducers={initialReducers}>
      <LayoutInnerPage type='policy' containerType='md'>
        <ShowPolicyText />
      </LayoutInnerPage>
    </DynamicModuleLoader>
  ));


export default PolicyPage;
