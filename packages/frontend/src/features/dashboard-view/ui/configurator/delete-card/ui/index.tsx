import { FC, memo, useCallback } from 'react';
import Box from '@mui/material/Box';
import { useCompany } from 'entities/company';
import { DeleteButton } from 'shared/ui/buttons/delete-button';
import { f } from 'shared/styles';
import { getAllChildren } from 'shared/lib/structures/view-items';
import { useDashboardViewServices } from '../../../../model/hooks';



export const DeleteItemContainer: FC = memo(() => {
  const { selectedId, viewItems, serviceDeleteViews } = useDashboardViewServices();
  const { paramsCompanyId } = useCompany();


  const handleDel = useCallback(() => {
    serviceDeleteViews({
      companyId      : paramsCompanyId,
      bunchUpdatedMs : Date.now(),
      viewItems      : getAllChildren(viewItems, selectedId)
    });
  },
    [selectedId, viewItems, paramsCompanyId, serviceDeleteViews]
  );


  return (
    <Box sx={{ ...f('-c-fe') }}>
      <DeleteButton
        toolTitle = 'Удалить этот элемент'
        onDel     = {handleDel}
      />
    </Box>
  )
});
