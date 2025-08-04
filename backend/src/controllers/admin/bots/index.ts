import * as v from '@utils/validators';
import { AdminBotWebApi } from '@web-api';
import { createController, getCommonQuery } from '@utils/controllers';
import { ErrorResponse } from '@utils/error-handler';
import * as botModel from '@models/bots';
import * as orderModel from '@models/orders';
import * as constants from '@constants';
import { runTransaction } from '@utils/database';

export const createBot = createController<AdminBotWebApi.CreateBot>(
  async (req, res) => {
    const botId = await botModel.createBot()();

    const orders = await orderModel.getOrders()({
      status: 'pending',
    });

    const pendingOrder = orders.find(order => order.botId === null);

    if (pendingOrder) {
      await orderModel.updateOrder()(pendingOrder.orderId, {
        botId: botId,
        orderStatus: 'processing',
      });

      setTimeout(async () => {
        const bot = await botModel.getBot()(botId);

        // Check has bot, if yes then only update status to prevent bot deleted before complete
        if (bot) {
          await orderModel.updateOrder()(pendingOrder.orderId, {
            orderStatus: 'complete',
          });
        }
      }, 10 * 1000); // 10 secs
    }

    return { data: { botId } };
  }
);

export const getBots = createController<AdminBotWebApi.GetBots>(
  async (req, res) => {
    const { limit, offset, keyword } = getCommonQuery(req);

    const { order_category } = req.query;

    if (order_category) {
      if (!v.hasKey(constants.OrderCategory)(order_category)) {
        throw new ErrorResponse('INVALID_PARAMS', 'Invalid order category');
      }
    }

    const bots = await botModel.getBots()({
      active: true,
      orderCategory: order_category,
      limit,
      offset,
      keyword,
    });

    return {
      data: {
        bots: bots.map(bot => ({
          botId: bot.botId,
          status: bot.status,
          active: bot.active === 1,
          order: bot.orderId
            ? {
                orderRunningId: bot.orderRunningId,
                orderId: bot.orderId,
                orderStatus: bot.orderStatus,
                orderCategory: bot.orderCategory,
                productId: bot.productId,
                productName: bot.productName,
              }
            : null,
        })),
      },
    };
  }
);

export const getBot = createController<AdminBotWebApi.GetBot>(
  async (req, res) => {
    const { botId } = req.params;

    const bot = await botModel.getBot()(botId);

    if (!bot) {
      throw new ErrorResponse('NOT_FOUND', 'Bot no found');
    }

    if (!bot.active) {
      throw new ErrorResponse('NOT_FOUND', 'Bot no found');
    }

    return {
      data: {
        botId: bot.botId,
        status: bot.status,
        active: bot.active === 1,
        order: bot.orderId
          ? {
              orderRunningId: bot.orderRunningId,
              orderId: bot.orderId,
              orderStatus: bot.orderStatus,
              orderCategory: bot.orderCategory,
              productId: bot.productId,
              productName: bot.productName,
            }
          : null,
      },
    };
  }
);

export const deleteBot = createController<AdminBotWebApi.DeleteBot>(
  async (req, res) => {
    const { botId } = req.params;

    const bot = await botModel.getBot()(botId);

    if (!bot) {
      throw new ErrorResponse('NOT_FOUND', 'Bot no found');
    }

    const orders = await orderModel.getOrders()({ botId });

    await runTransaction(async query => {
      await botModel.updateBot(query)(botId, { active: false });

      const botOrder = orders[0];

      if (botOrder && botOrder.status !== 'complete') {
        await orderModel.updateOrder(query)(botOrder.orderId, {
          orderStatus: 'pending',
        });
      }
    });

    return { statusCode: 204 };
  }
);

export const deleteNewestBot = createController<AdminBotWebApi.DeleteNewestBot>(
  async (req, res) => {
    const bots = await botModel.getBots()();

    const bot = bots[0];

    if (!bot) {
      throw new ErrorResponse('NOT_FOUND', 'No Bot');
    }

    const orders = await orderModel.getOrders()({ botId: bot.botId });

    await runTransaction(async query => {
      await botModel.updateBot(query)(bot.botId, { active: false });

      const botOrder = orders[0];

      if (botOrder && botOrder.status !== 'complete') {
        await orderModel.updateOrder(query)(botOrder.orderId, {
          orderStatus: 'pending',
        });
      }
    });

    return { statusCode: 204 };
  }
);
