import * as utils from '@utils';

const BASE_URL = process.env.REACT_APP_API_URL;

const axiosInstance = utils.axiosInstance;

export type ProductDetails = {
  productId: string;
  name: string;
  image: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string | null;
};

export const getProducts =
  (role: 'admin' | 'customer') =>
  async (options?: { limit?: number; keyword?: string }) => {
    try {
      const response = await axiosInstance.get<{ products: ProductDetails[] }>(
        `${BASE_URL}/${role}/products`,
        {
          params: { limit: options?.limit, keyword: options?.keyword },
          withCredentials: true,
        }
      );

      return response.data.products;
    } catch (error) {
      throw error;
    }
  };

export const getProduct =
  (role: 'admin' | 'customer') => async (productId: string) => {
    try {
      const response = await axiosInstance.get<ProductDetails>(
        `${BASE_URL}/${role}/products/${productId}`,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };
