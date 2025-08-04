import * as v from '@utils/validators';
import { AdminOrderWebApi } from '@web-api';
import { createController, getCommonQuery } from '@utils/controllers';
import { ErrorResponse } from '@utils/error-handler';
import * as orderModel from '@models/orders';
import * as constants from '@constants';

export const getOrders = createController<AdminOrderWebApi.GetOrders>(
  async (req, res) => {
    const { limit, offset, keyword } = getCommonQuery(req);

    const { status, order_category } = req.query;

    if (status !== undefined) {
      if (!v.hasKey(constants.OrderStatus)(status)) {
        throw new ErrorResponse('INVALID_PARAMS', 'Invalid status');
      }
    }

    if (order_category !== undefined) {
      if (!v.hasKey(constants.OrderCategory)(order_category)) {
        throw new ErrorResponse('INVALID_PARAMS', 'Invalid order category');
      }
    }

    const orders = await orderModel.getOrders()({
      status,
      category: order_category,
      limit,
      offset,
      keyword,
    });

    return {
      data: {
        orders: orders.map(order => ({
          orderRunningId: order.orderRunningId,
          orderId: order.orderId,
          product: {
            productId: order.productId,
            productName: order.productName,
          },
          customer: {
            userId: order.userId,
            name: order.name,
            category: order.userCategory,
          },
          botId: order.botId,
          category: order.category,
          status: order.status,
          createdAt: order.createdAt.toISOString(),
          updatedAt: order.updatedAt?.toISOString() || null,
        })),
      },
    };
  }
);

export const getOrder = createController<AdminOrderWebApi.GetOrder>(
  async (req, res) => {
    const { orderId } = req.params;

    const order = await orderModel.getOrder()(orderId);

    if (!order) {
      throw new ErrorResponse('NOT_FOUND', 'Order not found');
    }

    return {
      data: {
        orderRunningId: order.orderRunningId,
        orderId: order.orderId,
        product: {
          productId: order.productId,
          productName: order.productName,
        },
        customer: {
          userId: order.userId,
          name: order.name,
          category: order.userCategory,
        },
        botId: order.botId,
        category: order.category,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt?.toISOString() || null,
      },
    };
  }
);
