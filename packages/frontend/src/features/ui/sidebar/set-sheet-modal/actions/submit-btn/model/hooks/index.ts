import { useCallback, useMemo } from 'react';
import {
  creatorSheet, getSheetById, useCompany, validateCompanyData, validateDashboardSheetFields
} from 'entities/company';
import { getSlug, russianToEnglish } from 'shared/helpers/strings';
import { useUser } from 'entities/user';
import { createNextOrder } from 'entities/dashboard-view';
import { DefaultIconId } from 'shared/lib/icons';
import { SidebarListItem } from 'shared/types';
import { creatorFixDate } from 'entities/base';



export const useSheetSubmit = (
  editId         : string | undefined, // sheetId if edit
  sheetTitle     : string,
  selectedIconId : DefaultIconId | null,
) => {
  const { loading, paramsCompanyId, paramsSheets, serviceUpdateCompany, setErrors } = useCompany();
  const { userId } = useUser();


  const disabled = useMemo(() => {
    if (loading) return true;

    if (editId) {
      const sheetById = getSheetById(paramsSheets, editId);

      if (sheetById) return sheetTitle === sheetById.title && selectedIconId === sheetById.iconId
      else return true
    }
    else {
      const { valid } = validateDashboardSheetFields({ title: sheetTitle }, paramsSheets);
      return ! valid
    }
  },
    [editId, selectedIconId, sheetTitle, loading, paramsSheets]
  );


  const submitChanges = useCallback(() => {
    const { errors, valid } = validateDashboardSheetFields({ title: sheetTitle }, paramsSheets);
    if (! valid) return setErrors(errors);

    const sheets = Object.values(paramsSheets);

    let sheet = {} as SidebarListItem;

    if (editId && ! disabled) {
      const sheetById = getSheetById(paramsSheets, editId);

      if (! sheetById) return setErrors({ sheetTitle: 'Не найден лист для редактирования' });

      sheet.id    = sheetById.id;
      sheet.type  = sheetById.type;
      sheet.order = sheetById.order;

      sheet.iconId = selectedIconId && selectedIconId !== sheetById.iconId
        ? selectedIconId
        : sheetById.iconId;

      sheet.title = sheetTitle && sheetTitle !== sheetById.title
        ? sheetTitle
        : sheetById.title;

      sheet.lastChange = creatorFixDate(userId);
    }
    else {
      const id = getSlug(russianToEnglish(sheetTitle));

      sheet = {
        ...creatorSheet({
          userId,
          id,
          route  : id,
          title  : sheetTitle,
          iconId : selectedIconId || null,
          order  : createNextOrder(sheets),
        })
      }
    }

    const updatedData = {
      id: paramsCompanyId,
      sheets: {
        [sheet.id]: sheet
      }
    };

    const { valid: companyValid, errors: companyErrors } = validateCompanyData(updatedData);
    companyValid ? serviceUpdateCompany(updatedData) : setErrors(companyErrors);

    return companyValid
  },
    [
      editId, userId, paramsCompanyId, paramsSheets, selectedIconId, sheetTitle,
      disabled, serviceUpdateCompany, setErrors
    ]
  );


  return {
    disabled,
    submitChanges
  }
};
