import * as dbUtils from '@utils/database';
import * as utils from '@utils';
import { OrderCategory, OrderStatus } from '@root/types/database-table';

const { dbQuery, getInsertQuery, getSelectQuery, getUpdateQuery } = dbUtils;

export const createOrder =
  (query = dbQuery) =>
  async (payload: {
    productId: string;
    userId: string;
    orderCategory: OrderCategory;
  }) => {
    const orderId = utils.generateId(40, true);

    const { runQuery } = getInsertQuery('orders', {
      order_id: orderId,
      product_id: payload.productId,
      user_id: payload.userId,
      bot_id: null,
      status: 'pending',
      category: payload.orderCategory,
      updated_at: null,
    });

    await runQuery(query);

    return orderId;
  };

export const getOrders =
  (query = dbQuery) =>
  async (options?: {
    orderId?: string | string[];
    status?: OrderStatus;
    category?: OrderCategory;
    productId?: string | string[];
    userId?: string | string[];
    botId?: string | string[];
    limit?: number;
    offset?: number;
    keyword?: string;
  }) => {
    const { runQuery } = getSelectQuery('orders')
      .leftJoin('products', 'products.product_id = orders.product_id')
      .leftJoin('users', 'users.user_id = orders.user_id')
      .select(
        {
          orderRunningId: 'orders.id',
          orderId: 'orders.order_id',
          productId: 'orders.product_id',
          productName: 'products.name',
          userId: 'orders.user_id',
          name: 'users.display_name',
          userCategory: 'users.category',
          botId: 'orders.bot_id',
          category: 'orders.category',
          status: 'orders.status',
          createdAt: 'orders.created_at',
          updatedAt: 'orders.updated_at',
        },
        {
          'orders.order_id': options?.orderId,
          'orders.status': options?.status,
          'orders.category': options?.category,
          'orders.product_id': options?.productId,
          'orders.user_id': options?.userId,
          'orders.bot_id': options?.botId,
          _keyword: {
            fields: ['orders.category', 'products.name'],
            value: options?.keyword,
          },
        },
        {
          limit: options?.limit,
          offset: options?.offset,
          orderBy: 'ASC',
          sortBy: {
            specialCase: `CASE 
                    WHEN orders.category = 'vip' THEN 0
                    WHEN orders.category = 'normal' THEN 1
                    ELSE 2
                END,
                orders.created_at`,
          },
        }
      );

    return await runQuery(query);
  };

export const getOrder =
  (query = dbQuery) =>
  async (orderId: string) => {
    const { runQuery } = getSelectQuery('orders')
      .leftJoin('products', 'products.product_id = orders.product_id')
      .leftJoin('users', 'users.user_id = orders.user_id')
      .select(
        {
          orderRunningId: 'orders.id',
          orderId: 'orders.order_id',
          productId: 'orders.product_id',
          productName: 'products.name',
          userId: 'orders.user_id',
          name: 'users.display_name',
          userCategory: 'users.category',
          botId: 'orders.bot_id',
          category: 'orders.category',
          status: 'orders.status',
          createdAt: 'orders.created_at',
          updatedAt: 'orders.updated_at',
        },
        {
          'orders.order_id': orderId,
        }
      );

    const orders = await runQuery(query);

    return orders[0] || null;
  };

export const updateOrder =
  (query = dbQuery) =>
  async (
    orderId: string,
    payload: {
      productId?: string;
      orderStatus?: OrderStatus;
      orderCategory?: OrderCategory;
      botId?: string;
    }
  ) => {
    const { runQuery } = getUpdateQuery(
      'orders',
      {
        product_id: payload.productId,
        bot_id: payload.botId,
        status: payload.orderStatus,
        category: payload.orderCategory,
        updated_at: 'NOW()',
      },
      {
        order_id: orderId,
      }
    );

    await runQuery(query);
  };
