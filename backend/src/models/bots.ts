import { BotStatus, OrderCategory } from '@root/types/database-table';
import * as dbUtils from '@utils/database';
import * as utils from '@utils';

const { dbQuery, getInsertQuery, getSelectQuery, getUpdateQuery } = dbUtils;

export const createBot =
  (query = dbQuery) =>
  async () => {
    const botId = utils.generateId(40, true);

    const { runQuery } = getInsertQuery('bots', {
      bot_id: botId,
      status: 'idle',
      active: 1,
      updated_at: null,
    });

    await runQuery(query);

    return botId;
  };

export const getBots =
  (query = dbQuery) =>
  async (options?: {
    botId?: string | string[];
    status?: BotStatus;
    active?: boolean;
    orderCategory?: OrderCategory;
    limit?: number;
    offset?: number;
    keyword?: string;
  }) => {
    const { runQuery } = getSelectQuery('bots')
      .leftJoin('orders', 'orders.bot_id = bots.bot_id')
      .leftJoin('products', 'products.product_id = orders.product_id')
      .select(
        {
          id: 'bots.id',
          botId: 'bots.bot_id',
          status: 'bots.status',
          active: 'bots.active',
          orderRunningId: 'orders.id',
          orderId: 'orders.order_id',
          orderStatus: 'orders.status',
          orderCategory: 'orders.category',
          productId: 'products.product_id',
          productName: 'products.name',
          createdAt: 'bots.created_at',
          updatedAt: 'bots.updated_at',
        },
        {
          'bots.bot_id': options?.botId,
          'bots.status': options?.status,
          'bots.active': options?.active
            ? options.active === true
              ? 1
              : 0
            : undefined,
          'orders.category': options?.orderCategory,
          _keyword: {
            fields: ['products.name', 'orders.category'],
            value: options?.keyword,
          },
        },
        {
          limit: options?.limit,
          offset: options?.offset,
          sortBy: 'bots.created_at',
          orderBy: 'DESC',
        }
      );

    return await runQuery(query);
  };

export const getBot =
  (query = dbQuery) =>
  async (botId: string) => {
    const { runQuery } = getSelectQuery('bots')
      .leftJoin('orders', 'orders.bot_id = bots.bot_id')
      .leftJoin('products', 'products.product_id = orders.product_id')
      .select(
        {
          id: 'bots.id',
          botId: 'bots.bot_id',
          status: 'bots.status',
          active: 'bots.active',
          orderRunningId: 'orders.id',
          orderId: 'orders.order_id',
          orderStatus: 'orders.status',
          orderCategory: 'orders.category',
          productId: 'products.product_id',
          productName: 'products.name',
          createdAt: 'bots.created_at',
          updatedAt: 'bots.updated_at',
        },
        {
          'bots.bot_id': botId,
        }
      );

    const bots = await runQuery(query);

    return bots[0] || null;
  };

export const updateBot =
  (query = dbQuery) =>
  async (
    botId: string,
    payload: {
      status?: BotStatus;
      active?: boolean;
    }
  ) => {
    if (botId?.length < 1) return;

    const { runQuery } = getUpdateQuery(
      'bots',
      {
        status: payload.status,
        active:
          payload.active !== undefined ? (payload.active ? 1 : 0) : undefined,
        updated_at: 'NOW()',
      },
      {
        bot_id: botId,
      }
    );

    await runQuery(query);
  };
