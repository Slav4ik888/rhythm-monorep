import { AxiosInstance } from 'axios';
import { PartialUser } from 'entities/user';
import { API_PATHS } from '../../../api-paths';


export const userApi = {
  update: async (api: AxiosInstance, userData: PartialUser): Promise<void> => {
    await api.post(API_PATHS.user.update, { userData });
  },
  logout: async (api: AxiosInstance): Promise<void> => {
    await api.post(API_PATHS.user.logout);
  },
};
