// packages/frontend/src/shared/api/features/dashboard-templates/index.ts

import { api } from '../../api';
import { API_PATHS } from '../../api-paths';

// Типы для тела запроса
export interface DeleteTemplateReq {
  id: string;
  companyId: string;
}

export interface UpdateTemplateReq {
  id: string;
  companyId: string;
  [key: string]: any;
}

// Типы для ответа API
export interface DeleteTemplateRes {
  templateId: string;
  bunchUpdatedMs: number;
  bunchId: string;
}

export interface UpdateTemplateRes {
  template: any;
  bunchUpdatedMs: number;
  fullSet: boolean;
}

// Устаревшие алиасы для обратной совместимости
export type DeleteTemplate = DeleteTemplateReq;
export type UpdateTemplate = UpdateTemplateReq;

export interface GetTemplatesReq {
  companyId: string;
}

export interface TemplatesBunchesUpdated {
  [bunchId: string]: number;
}

export const getTemplates = async ({ companyId }: GetTemplatesReq): Promise<any[]> => {
  const { data } = await api.get(`${API_PATHS.templates.getTemplates}?companyId=${companyId}`);
  return data;
};

export const getTemplatesBunchesUpdated = async ({
  companyId,
}: {
  companyId: string;
}): Promise<TemplatesBunchesUpdated> => {
  const { data } = await api.get(`${API_PATHS.templates.getBunchesUpdated}?companyId=${companyId}`);
  return data;
};

export const updateTemplate = async (template: UpdateTemplateReq): Promise<UpdateTemplateRes> => {
  const { data } = await api.post<UpdateTemplateRes>(API_PATHS.templates.update, template);
  return data;
};

export const deleteTemplate = async ({ id, companyId }: DeleteTemplateReq): Promise<DeleteTemplateRes> => {
  const { data } = await api.post<DeleteTemplateRes>(API_PATHS.templates.delete, { id, companyId });
  return data;
};
