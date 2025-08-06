import LoadingScreen from '@components/LoadingScreen';
import { BotDetails, OrderDetails } from '../../types/general';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import * as utils from '@utils';

const Bots = (props: { setUpdate: (input: boolean) => void }) => {
  const [bots, setBots] = useState<BotDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const canAction = useRef(true);

  const getBots = () => {
    try {
      const response = utils.getCookie<BotDetails[]>('bots') || [];

      setBots(response);
    } catch (error) {
      setBots([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBots();
  }, []);

  const handleBot = async (action: 'add' | 'remove') => {
    if (!canAction.current) return;

    canAction.current = false;

    try {
      const bots = utils.getCookie<BotDetails[]>('bots') || [];
      const orders = utils.getCookie<OrderDetails[]>('orders') || [];

      if (action === 'add') {
        const pendingOrder = orders.find(
          order => order.status === 'pending' && order.botId === null
        );

        const botId = utils.generateId(10);

        bots.push({
          botId,
          status: pendingOrder ? 'working' : 'idle',
          order: pendingOrder
            ? {
                orderId: pendingOrder.orderId,
                orderStatus: 'processing',
                orderCategory: pendingOrder.category,
              }
            : null,
        });

        if (pendingOrder) {
          const targetOrderIndex = orders.findIndex(
            order => order.orderId === pendingOrder.orderId
          );

          if (orders[targetOrderIndex]) {
            orders[targetOrderIndex].botId = botId;
            orders[targetOrderIndex].status = 'processing';

            setTimeout(() => {
              const latestOrders =
                utils.getCookie<typeof orders>('orders') || [];
              const latestBots = utils.getCookie<typeof bots>('bots') || [];

              utils.setCookie(
                'bots',
                latestBots.map(bot =>
                  bot.botId === botId
                    ? {
                        ...bot,
                        order: {
                          orderId: pendingOrder.orderId,
                          orderCategory: pendingOrder.category,
                          orderStatus: 'complete',
                        },
                        status: 'idle',
                      }
                    : bot
                )
              );
              utils.setCookie(
                'orders',
                latestOrders.map(order =>
                  order.orderId === pendingOrder.orderId && order.botId !== null
                    ? { ...order, status: 'complete' }
                    : order
                )
              );

              props.setUpdate(true);
              getBots();

              setTimeout(() => props.setUpdate(false), 50);
            }, 10000);
          }
        }
      } else {
        const botOrderIndex = orders.findIndex(
          o => o.botId === bots[bots.length - 1]?.botId
        );

        const targetOrder = orders[botOrderIndex];
        if (targetOrder) {
          targetOrder.status =
            targetOrder.status !== 'complete' ? 'pending' : targetOrder.status;
          targetOrder.botId = null;

          orders[botOrderIndex] = targetOrder;
        }

        bots.pop();
      }

      utils.setCookie('bots', bots);
      utils.setCookie('orders', orders);
      props.setUpdate(true);
    } catch (error: any) {
      console.log(error);
      toast.error('Unexpected Error. Please try again later.');
    } finally {
      getBots();

      setTimeout(() => {
        props.setUpdate(false);
        canAction.current = true;
      }, 50);
    }
  };

  return (
    <div className="bots">
      <LoadingScreen isLoading={isLoading} />
      <div className="container">
        <div className="top-wrapper">
          <span className="add-bot" onClick={() => handleBot('add')}>
            + Bot
          </span>
          {bots.length > 0 && (
            <span className="remove-bot" onClick={() => handleBot('remove')}>
              - Bot
            </span>
          )}
        </div>

        <div className="bots-container list-container">
          <div className="bots-header list-header">
            <div className="bots-header-item list-header-item">No.</div>
            <div className="bots-header-item list-header-item">Bot Status</div>
            <div className="bots-header-item list-header-item">Order Id</div>
            <div className="bots-header-item list-header-item">Category</div>
            <div className="bots-header-item list-header-item">
              Order Status
            </div>
          </div>

          {bots.length > 0 ? (
            bots.map((bot, index) => (
              <div key={bot.botId} className="bot-content list-content">
                <div className="bot-content-item list-content-item">
                  {index + 1}
                </div>

                <div className="bot-content-item list-content-item">
                  {bot.status}
                </div>

                <div className="bot-content-item list-content-item">
                  {bot.order ? bot.order.orderId : '-'}
                </div>

                <div className="bot-content-item list-content-item">
                  {bot.order ? bot.order.orderCategory.toUpperCase() : '-'}
                </div>

                <div
                  className={`bot-content-item list-content-item ${
                    bot.order ? bot.order.orderStatus : ''
                  }`}
                >
                  {bot.order ? bot.order.orderStatus.toUpperCase() : ''}
                </div>
              </div>
            ))
          ) : (
            <p className="not-found">No Result Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bots;
