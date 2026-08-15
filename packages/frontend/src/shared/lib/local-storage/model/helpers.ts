// packages/frontend/src/shared/lib/local-storage/model/helpers.ts

import { UIConfiguratorProviderState } from 'app/providers/theme';
import { PartialCompany, StateSchemaCompany } from 'entities/company';
import { StateSchemaDashboardData } from 'entities/dashboard-data';
import type { Template } from 'entities/dashboard-templates';
import { BunchesViewItem } from 'entities/dashboard-view/types';
import { StateSchemaUser } from 'entities/user';
import { isStr } from '../../validators';
import { ResGetData } from 'shared/types';
import type { BunchesUpdated } from '../../structures/bunch';
import { setStorageData, getStorageData } from './main';
import { HeavyStorage } from '../../indexed-db';

/** Auth */
export const setAcceptedCookie = () => setStorageData('acceptedCookie', { isAccepted: 'true' });
export const getAcceptedCookie = (): string =>
  getStorageData<{ isAccepted: string }>('acceptedCookie')?.isAccepted || 'false';

// Hints
export const getHintsDontShowAgain = (): string[] => getStorageData<string[]>('hintsDontShowAgain') || [];
export const setHintsDontShowAgain = (currentHintId: string | string[]) =>
  setStorageData(
    'hintsDontShowAgain',
    isStr(currentHintId) ? [...getHintsDontShowAgain(), currentHintId] : [...(currentHintId as string[])], // Если передали массив
  );

// User
export const setUserState = (companyId: string, data: StateSchemaUser) =>
  setStorageData(`userState-${companyId}`, data);
export const getUserState = (companyId: string) => getStorageData<StateSchemaUser>(`userState-${companyId}`);

// Company
export const setLastCompanyId = (companyId: string) => setStorageData('lastCompanyId', { companyId });
export const getLastCompanyId = () => getStorageData<{ companyId: string }>('lastCompanyId')?.companyId;

export const setCompanyState = (companyId: string, data: StateSchemaCompany) =>
  setStorageData(`companyState-${companyId}`, data);
export const getCompanyState = (companyId: string) => getStorageData<StateSchemaCompany>(`companyState-${companyId}`);

export const setParamsCompanyState = (data: PartialCompany) => setStorageData('paramsCompany', data);
export const getParamsCompanyState = () => getStorageData<PartialCompany>('paramsCompany');

// Configurator
export const setUIConfiguratorState = (data: UIConfiguratorProviderState) =>
  setStorageData('UIConfiguratorState', data);
export const getUIConfiguratorState = () => getStorageData<UIConfiguratorProviderState>('UIConfiguratorState');
export const setEditMode = (companyId: string, editMode: boolean) =>
  setStorageData(`editMode-${companyId}`, { editMode });
export const getEditMode = (companyId: string): boolean =>
  Boolean(getStorageData<{ editMode?: boolean }>(`editMode-${companyId}`)?.editMode);

// Dashboard-templates
export const setTemplates = (data: Template[]) => setStorageData('templates', data);
export const getTemplates = () => getStorageData<Template[]>('templates') || [];

/** Dashboard-templates - timestamp of last updated */
export const setTemplatesBunchesUpdated = (data: BunchesUpdated) => {
  setStorageData('templatesBunchesUpdated', data);
  // Триггерим событие для других вкладок
  window.dispatchEvent(new Event('storage'));
};
export const getTemplatesBunchesUpdated = () => getStorageData<BunchesUpdated>('templatesBunchesUpdated') || {};

// Dashboard-data
// Тяжёлые per-company данные хранятся в IndexedDB (не в localStorage — квота ~5 МБ).
export const setDataState = (companyId: string, data: StateSchemaDashboardData) =>
  HeavyStorage.set(`dataState-${companyId}`, data);
export const getDataState = (companyId: string) => HeavyStorage.get<StateSchemaDashboardData>(`dataState-${companyId}`);

// Dashboard-view
// Тяжёлые per-company данные хранятся в IndexedDB (не в localStorage — квота ~5 МБ).
export const setBunches = (companyId: string, bunches: BunchesViewItem) =>
  HeavyStorage.set(`bunches-${companyId}`, bunches);
export const getBunches = (companyId: string) => HeavyStorage.get<BunchesViewItem>(`bunches-${companyId}`) || {};

/** Dashboard-view - timestamp of last updated */
export const setViewBunchesUpdated = (companyId: string, data: BunchesUpdated) => {
  HeavyStorage.set(`viewBunchesUpdated-${companyId}`, data);
  // Событие для текущей вкладки (same-tab). Кросс-вкладочно данные синхронизируются
  // через BroadcastChannel внутри HeavyStorage (см. shared/lib/indexed-db/broadcast.ts).
  window.dispatchEvent(new Event('storage'));
};
export const getViewBunchesUpdated = (companyId: string) =>
  HeavyStorage.get<BunchesUpdated>(`viewBunchesUpdated-${companyId}`) || {};

// Partners
export const setPartnerId = (code: string | null) => setStorageData('partnerId', code);
export const getPartnerId = () => getStorageData<string | undefined>('partnerId');

// Dev
// Сырые данные /api/getData — самые «тяжёлые», тоже вынесены в IndexedDB.
export const devSetGSData = (companyId: string, data: ResGetData) =>
  HeavyStorage.set(`Dashboard-GSData-${companyId}`, data);
export const devGetGSData = (companyId: string) => HeavyStorage.get<ResGetData>(`Dashboard-GSData-${companyId}`);
