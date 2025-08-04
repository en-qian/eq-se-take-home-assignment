import * as utils from '@utils';

const BASE_URL = process.env.REACT_APP_API_URL;

const axiosInstance = utils.axiosInstance;

export type OrderStatus = 'pending' | 'processing' | 'complete';
export type OrderCategory = 'vip' | 'normal';
export type BotStatus = 'idle' | 'working';

export type BotDetails = {
  botId: string;
  status: BotStatus;
  active: boolean;
  order: {
    orderRunningId: number;
    orderId: string;
    orderStatus: OrderStatus;
    orderCategory: OrderCategory;
    productId: string;
    productName: string;
  } | null;
};

export const createBot = async () => {
  try {
    const response = await axiosInstance.post<{ botId: string }>(
      `${BASE_URL}/admin/bots/`,
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

export const getBots = async (options?: { orderCategory: OrderCategory }) => {
  try {
    const response = await axiosInstance.get<{ bots: BotDetails[] }>(
      `${BASE_URL}/admin/bots`,
      {
        params: {
          order_category: options?.orderCategory,
        },
        withCredentials: true,
      }
    );

    return response.data.bots;
  } catch (error) {
    throw error;
  }
};

export const getBot = async (botId: string) => {
  try {
    const response = await axiosInstance.get<BotDetails>(
      `${BASE_URL}/admin/bots/${botId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBot = async (botId: string) => {
  try {
    await axiosInstance.delete(`${BASE_URL}/admin/bots/${botId}`, {
      withCredentials: true,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteNewestBot = async () => {
  try {
    await axiosInstance.delete(`${BASE_URL}/admin/bots/newest`, {
      withCredentials: true,
    });
  } catch (error) {
    throw error;
  }
};
