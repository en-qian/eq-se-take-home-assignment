import * as utils from '@utils';

const BASE_URL = process.env.REACT_APP_API_URL;

const axiosInstance = utils.axiosInstance;

type UserRole = 'admin' | 'customer';
type CustomerRole = 'vip' | 'normal';

export const initialize = async () => {
  try {
    const response = await axiosInstance.post<{
      userId: string;
      email: string;
      name: string;
      role: UserRole;
      category: CustomerRole;
    }>(
      `${BASE_URL}/auth/initialize`,
      {},
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/auth/login`,
      {
        data: utils.encrypt({ email, password }),
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post(
      `${BASE_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  } catch (error) {
    throw error;
  }
};
