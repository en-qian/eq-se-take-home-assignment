import { useEffect, useState } from 'react';
import * as utils from '@utils';
import { OrderDetails, OrderStatus } from '../types/general';
import moment from 'moment';

const Orders = (props: { update: boolean }) => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);

  const getOrders = (status?: OrderStatus) => {
    const response = utils.getCookie<OrderDetails[]>('orders') || [];
    const filtered = response.filter(o =>
      status ? o.status === status : true
    );

    setOrders(filtered);
  };

  const handleClick = (
    e: React.MouseEvent<HTMLSpanElement>,
    status?: OrderStatus
  ) => {
    e.currentTarget.classList.add('active');
    getOrders(status);
  };

  const createOrder = (category: 'vip' | 'normal') => {
    const orders = utils.getCookie<OrderDetails[]>('orders') || [];

    orders.push({
      orderId: orders.length + 1,
      botId: null,
      category: category,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    utils.setCookie(
      'orders',
      orders.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category === 'vip' ? -1 : 1;
        }

        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      })
    );

    getOrders();
  };

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (props.update) {
      getOrders();
    }
  }, [props.update]);

  return (
    <div className="orders">
      <div className="container">
        <div className="order-top-wrapper">
          <div className="status-filter">
            <span className="status-filter-item" onClick={e => handleClick(e)}>
              All
            </span>
            <span
              className="status-filter-item"
              onClick={e => handleClick(e, 'pending')}
            >
              Pending
            </span>
            <span
              className="status-filter-item"
              onClick={e => handleClick(e, 'complete')}
            >
              Complete
            </span>
          </div>

          <div className="add-order">
            <span className="vip-order" onClick={() => createOrder('vip')}>
              + VIP
            </span>
            <span
              className="normal-order"
              onClick={() => createOrder('normal')}
            >
              + Normal
            </span>
          </div>
        </div>

        <div className="orders-container list-container">
          <div className="orders-header list-header">
            <div className="orders-header-item list-header-item">No.</div>
            <div
              className="orders-header-item list-header-item"
              style={{ width: '15%' }}
            >
              Order Id
            </div>
            <div
              className="orders-header-item list-header-item"
              style={{ width: '25%' }}
            >
              Category
            </div>
            <div
              className="orders-header-item list-header-item"
              style={{ width: '25%' }}
            >
              Order Status
            </div>
            <div
              className="orders-header-item list-header-item"
              style={{ width: '25%' }}
            >
              Created At
            </div>
          </div>

          {orders.length > 0 ? (
            orders.map((_, index) => (
              <div key={index} className="bot-content list-content">
                <div className="bot-content-item list-content-item">
                  {index + 1}
                </div>

                <div
                  className="bot-content-item list-content-item"
                  style={{ width: '15%' }}
                >
                  {_.orderId}
                </div>

                <div
                  className="bot-content-item list-content-item"
                  style={{ width: '25%' }}
                >
                  {_.category === 'normal' ? 'Normal' : 'VIP'}
                </div>

                <div
                  className="bot-content-item list-content-item"
                  style={{ width: '25%' }}
                >
                  {_.status === 'complete'
                    ? 'Complete'
                    : _.status === 'processing'
                    ? 'Processing'
                    : 'Pending'}
                </div>

                <div
                  className="bot-content-item list-content-item"
                  style={{ width: '25%' }}
                >
                  {moment(_.createdAt).format('YYYY-MM-DD HH:mm:ssA')}
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

export default Orders;
