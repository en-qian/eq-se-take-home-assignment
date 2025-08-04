import { BaseApi } from '@utils/controllers';

type ProductDetails = {
  productId: string;
  name: string;
  image: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string | null;
};

export interface GetProducts extends BaseApi {
  Method: 'GET';
  Route: '/api/customer/products';
  ReqParams: {};
  ReqQuery: { limit?: string; offset?: string; keyword?: string };
  ReqBody: {};
  ResBody: {
    products: ProductDetails[];
  };
}

export interface GetProduct extends BaseApi {
  Method: 'GET';
  Route: '/api/customer/products/:productId';
  ReqParams: { productId: string };
  ReqQuery: {};
  ReqBody: {};
  ResBody: ProductDetails;
}
