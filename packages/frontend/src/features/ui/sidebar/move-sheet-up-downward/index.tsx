import { FC, memo, useCallback } from 'react';
import { Toward, TowardType } from 'shared/ui/configurators-components/toward';
import { calcNewOrder } from 'shared/lib/calc-new-order';
import { sortingArr } from 'shared/helpers/sorting';
import { getSheetById, useCompany } from 'entities/company';
import { creatorFixDate } from 'entities/base';
import { useUser } from 'entities/user';



interface Props {
  editId: string | undefined  // sheetId if edit
}

/**
 * Перемещение (изменение order) между sheets
 */
export const MoveSheetUpdownward: FC<Props> = memo(({ editId }) => {
  const { paramsSheets, paramsCompanyId, serviceUpdateCompany } = useCompany();
  const { userId } = useUser();


  const handleClick = useCallback((type: TowardType) => {
    if (! editId) return

    const sheet = getSheetById(paramsSheets, editId);
    if (! sheet) return

    serviceUpdateCompany({
      id     : paramsCompanyId,
      sheets : {
        [sheet.id]: {
          ...sheet,
          order      : calcNewOrder(type, sortingArr(Object.values(paramsSheets), 'order'), sheet),
          lastChange : creatorFixDate(userId)
        }
      }
    });
  }, [paramsSheets, editId, paramsCompanyId, userId, serviceUpdateCompany]);


  return (
    <>
      <Toward type='up'   onClick={handleClick} />
      <Toward type='down' onClick={handleClick} />
    </>
  )
});
