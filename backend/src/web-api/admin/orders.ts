import { BaseApi } from '@utils/controllers';
import * as constants from '@constants';
import { CustomerCategory } from '@root/types/database-table';

export type OrderStatus = keyof typeof constants.OrderStatus;
export type OrderCategory = keyof typeof constants.OrderCategory;

type OrderDetails = {
  orderRunningId: number;
  orderId: string;
  product: {
    productId: string;
    productName: string;
  };
  customer: {
    userId: string;
    name: string;
    category: CustomerCategory;
  };
  botId: string | null;
  category: OrderCategory;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string | null;
};

export interface GetOrders extends BaseApi {
  Method: 'GET';
  Route: '/api/admin/orders';
  ReqParams: {};
  ReqQuery: {
    status?: OrderStatus;
    order_category?: OrderCategory;
    limit?: string;
    offset?: string;
    keyword?: string;
  };
  ReqBody: {};
  ResBody: {
    orders: OrderDetails[];
  };
}

export interface GetOrder extends BaseApi {
  Method: 'GET';
  Route: '/api/admin/orders/:orderId';
  ReqParams: { orderId: string };
  ReqQuery: {};
  ReqBody: {};
  ResBody: OrderDetails;
}
