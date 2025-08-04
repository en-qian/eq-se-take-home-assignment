import * as utils from '@utils';

const BASE_URL = process.env.REACT_APP_API_URL;

const axiosInstance = utils.axiosInstance;

export type OrderStatus = 'pending' | 'processing' | 'complete';
export type OrderCategory = 'vip' | 'normal';

export type OrderDetails = {
  orderRunningId: number;
  orderId: string;
  product: {
    productId: string;
    productName: string;
  };
  category: OrderCategory;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string | null;
};

export const getOrders =
  (role: 'admin' | 'customer') =>
  async (options?: {
    orderCategory?: string;
    status?: OrderStatus;
    keyword?: string;
  }) => {
    try {
      const response = await axiosInstance.get<{ orders: OrderDetails[] }>(
        `${BASE_URL}/${role}/orders`,
        {
          params: {
            order_category: options?.orderCategory,
            status: options?.status,
            keyword: options?.keyword,
          },
          withCredentials: true,
        }
      );

      return response.data.orders;
    } catch (error) {
      throw error;
    }
  };

export const getOrder =
  (role: 'admin' | 'customer') => async (orderId: string) => {
    try {
      const response = await axiosInstance.get<OrderDetails>(
        `${BASE_URL}/${role}/orders/${orderId}`,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

export const createOrder = async (productId: string) => {
  try {
    const response = await axiosInstance.post<{ orderId: string }>(
      `${BASE_URL}/customer/orders`,
      {
        productId,
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
