import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Errors } from 'shared/lib/validators';
import { Company, CustomSettings, ParamsCompany } from '../../types';
import { getPayloadError as getError } from 'shared/lib/errors';
import { StateSchemaCompany } from './state-schema';
import { updateObject } from 'shared/helpers/objects';
import { LS } from 'shared/lib/local-storage';
import { SetCompany } from './types';
import {
  SetParamsCompany, getParamsCompany, updateCompany, deleteSheet, DeleteSheet
} from 'shared/api/features/company';



const initialState: StateSchemaCompany = {
  loading                  : false,
  errors                   : {},
  company                  : {} as Company,
  paramsCompany            : {} as ParamsCompany,
  storedCompany            : {} as ParamsCompany,
  _isParamsCompanyIdLoaded : false, // Загрузка по paramsCompanyId
};


const slice = createSlice({
  name: 'entities/company',
  initialState,
  reducers: {
    setErrors: (state, { payload }: PayloadAction<Errors | undefined>) => {
      state.errors = getError(payload);
    },
    setCompany: (state, { payload }: PayloadAction<SetCompany>) => {
      state.company       = payload.company;
      state.storedCompany = payload.company;
      state.paramsCompany = payload.company; // Если по итогу paramsCompanyId окажется другой, то перезапишется
      LS.setCompanyState(payload.company.id, state);
      LS.setLastCompanyId(payload.company.id);
    },
    updateParamsCompany: (state, { payload }: PayloadAction<Partial<ParamsCompany>>) => {
      state.paramsCompany = updateObject(state.paramsCompany, payload);
    },
    setIsParamsCompanyIdLoaded: (state, { payload }: PayloadAction<boolean>) => {
      state._isParamsCompanyIdLoaded = payload;
    },
    updateParamsCustomSettings: (state, { payload }: PayloadAction<Partial<CustomSettings>>) => {
      if (! state.paramsCompany.customSettings) state.paramsCompany.customSettings = {};
      state.paramsCompany.customSettings = updateObject(state.paramsCompany.customSettings, payload);
    },
    cancelParamsCustomSettings: (state) => {
      if (state.storedCompany) {
        state.paramsCompany = { ...state.storedCompany };
        state.storedCompany = {} as ParamsCompany;
      }
    }
  },

  extraReducers: builder => {
    // GET-PARAMS-COMPANY
    builder
      .addCase(getParamsCompany.pending, (state) => {
        state.loading = true;
        state.errors = {};
      })
      .addCase(getParamsCompany.fulfilled, (state, { payload }: PayloadAction<SetParamsCompany>) => {
        state.storedCompany            = payload.paramsCompany;
        state.paramsCompany            = payload.paramsCompany;
        state._isParamsCompanyIdLoaded = true;
        state.loading                  = false;
        state.errors                   = {};

        if (payload.paramsCompany?.id) {
          LS.setParamsCompanyState(payload.paramsCompany);
        }
      })
      .addCase(getParamsCompany.rejected, (state, { payload }) => {
        state._isParamsCompanyIdLoaded = true; // Чтобы не попасть в беск цикл запросов
        state.errors                   = getError(payload);
        state.loading                  = false;
      })
    // COMPANY-UPDATE
    builder
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.errors = {};
      })
      .addCase(updateCompany.fulfilled, (state, { payload }: PayloadAction<Partial<Company>>) => {
        state.paramsCompany = updateObject(state.paramsCompany, payload);
        state.storedCompany = state.paramsCompany;
        state.loading       = false;
        state.errors        = {};
      })
      .addCase(updateCompany.rejected, (state, { payload }) => {
        state.errors  = getError(payload);
        state.loading = false;
      })

    // DELETE-SHEET
    builder
      .addCase(deleteSheet.pending, (state) => {
        state.loading = true;
        state.errors = {};
      })
      .addCase(deleteSheet.fulfilled, (state, { payload }: PayloadAction<DeleteSheet>) => {
        const { sheetId } = payload;
        if (state.paramsCompany?.sheets?.[sheetId]) delete state.paramsCompany.sheets[sheetId];
        if (state.storedCompany?.sheets?.[sheetId]) delete state.storedCompany.sheets[sheetId];

        state.loading = false;
        state.errors  = {};
      })
      .addCase(deleteSheet.rejected, (state, { payload }) => {
        state.errors  = getError(payload);
        state.loading = false;
      })
  }
})

export const { actions, reducer } = slice;
