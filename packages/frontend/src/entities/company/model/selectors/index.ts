import { createSelector } from '@reduxjs/toolkit';
import { StateSchema } from 'app/providers/store';
import { getChanges } from 'shared/helpers/objects';
import { StateSchemaCompany } from '../slice/state-schema';
import { ParamsCompany } from '../../types';


export const selectModule = createSelector(
  [(state: StateSchema) => state.company || {} as StateSchemaCompany],
  (state: StateSchemaCompany) => state
);
export const selectLoading = createSelector(selectModule, (state: StateSchemaCompany) => state.loading);
export const selectErrors  = createSelector(selectModule, (state: StateSchemaCompany) => state.errors);

export const selectIsParamsCompanyIdLoaded = createSelector(
  selectModule,
  (state: StateSchemaCompany) => state._isParamsCompanyIdLoaded
);

export const selectCompany       = createSelector(selectModule, (state: StateSchemaCompany) => state.company || {});
export const selectStoredCompany = createSelector(selectModule, (state: StateSchemaCompany) => state.storedCompany);
export const selectParamsCompany = createSelector(selectModule, (state: StateSchemaCompany) => state.paramsCompany);

export const selectParamsCustomSettings = createSelector(
  selectParamsCompany,
  (paramsCompany: ParamsCompany) => paramsCompany?.customSettings || {}
);

export const selectParamsSheets = createSelector(
  selectParamsCompany,
  (company: ParamsCompany) => company?.sheets || {}
);

/** Списо пользователей имеющих доступ ('v' | 'e') к /dashboard  */
// export const selectUsersAccessDashboard = createSelector(selectParamsCompany, (paramsCompany: ParamsCompany) => {
//   if (! paramsCompany || ! paramsCompany.dashboardMembers) return [];

//   return paramsCompany.dashboardMembers.filter(member => member.a?.f === 'v' || member.a?.f === 'e');
// });


// export const selectCustomSettings = createSelector(selectCompany, (company: Company) => company?.customSettings || {});

// Возвращает объект с изменившимися полями
export const selectParamsChangedCompany = createSelector(
  selectModule,
  (state: StateSchemaCompany) => getChanges(state.storedCompany, state.paramsCompany)
);
// export const selectChangedCompany = createSelector(selectModule, (state: StateSchemaCompany) =>
//   getChanges(state.storedCompany, state.company));
