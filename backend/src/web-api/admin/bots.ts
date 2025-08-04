import { BotStatus } from '@root/types/database-table';
import { BaseApi } from '@utils/controllers';
import * as constants from '@constants';

export type OrderStatus = keyof typeof constants.OrderStatus;
export type OrderCategory = keyof typeof constants.OrderCategory;

type BotDetails = {
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

export interface CreateBot extends BaseApi {
  Method: 'POST';
  Route: '/api/admin/bots';
  ReqParams: {};
  ReqQuery: {};
  ReqBody: {};
  ResBody: { botId: string };
}

export interface GetBots extends BaseApi {
  Method: 'GET';
  Route: '/api/admin/bots';
  ReqParams: {};
  ReqQuery: {
    limit?: string;
    offset?: string;
    keyword?: string;
    order_category?: OrderCategory;
  };
  ReqBody: {};
  ResBody: {
    bots: BotDetails[];
  };
}

export interface GetBot extends BaseApi {
  Method: 'GET';
  Route: '/api/admin/bots/:botId';
  ReqParams: { botId: string };
  ReqQuery: {};
  ReqBody: {};
  ResBody: BotDetails;
}

export interface DeleteBot extends BaseApi {
  Method: 'DELETE';
  Route: '/api/admin/bots/:botId';
  ReqParams: { botId: string };
  ReqQuery: {};
  ReqBody: {};
  ResBody: undefined;
}

export interface DeleteNewestBot extends BaseApi {
  Method: 'DELETE';
  Route: '/api/admin/bots/newest';
  ReqParams: {};
  ReqQuery: {};
  ReqBody: {};
  ResBody: undefined;
}
