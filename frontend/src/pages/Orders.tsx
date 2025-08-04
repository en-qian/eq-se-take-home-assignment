import * as orderApi from '@api/orders';
import { useEffect, useState } from 'react';
import * as utils from '@utils';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import LoadingScreen from '@components/LoadingScreen';

const PAGINATION_OFFSET = 10;

const Orders = () => {
  const [orders, setOrders] = useState<orderApi.OrderDetails[]>([]);
  const [displayedItems, setDisplayedItems] = useState<orderApi.OrderDetails[]>(
    []
  );
  const [offset, setOffset] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const role =
    utils.getCookie<{ role: 'admin' | 'customer' }>('user_data')?.role ===
    'admin'
      ? 'admin'
      : 'customer';

  const getOrders = async (status?: orderApi.OrderStatus) => {
    try {
      const response = await orderApi.getOrders(role)({ status });

      setOrders(response);
      setTotalPage(Math.ceil(response.length / PAGINATION_OFFSET));
      setDisplayedItems(response.slice(0, PAGINATION_OFFSET));
    } catch (error) {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (
    e: React.MouseEvent<HTMLSpanElement>,
    status?: orderApi.OrderStatus
  ) => {
    e.currentTarget.classList.add('active');
    getOrders(status);
  };

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    setDisplayedItems(
      orders.slice(
        offset * PAGINATION_OFFSET,
        offset * PAGINATION_OFFSET + PAGINATION_OFFSET
      )
    );
  }, [offset]);

  return (
    <div className="orders page">
      <LoadingScreen isLoading={isLoading} />
      <div className="container">
        <h1>Orders</h1>

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

        <div className="orders-container list-container">
          <div className="orders-header list-header">
            <div className="orders-header-item list-header-item">No.</div>
            <div
              className="orders-header-item list-header-item"
              style={{ width: '10%' }}
            >
              Order Id
            </div>
            <div
              className="orders-header-item list-header-item"
              style={{ width: '26%' }}
            >
              Name
            </div>
            <div className="orders-header-item list-header-item">
              Order Category
            </div>
            <div className="orders-header-item list-header-item">
              Order Status
            </div>
            <div className="orders-header-item list-header-item">Product</div>
          </div>

          {displayedItems.length > 0 ? (
            displayedItems.map((_, index) => (
              <div key={index} className="bot-content list-content">
                <div className="bot-content-item list-content-item">
                  {index + 1}
                </div>

                <div
                  className="bot-content-item list-content-item"
                  style={{ width: '10%' }}
                >
                  {_.orderRunningId}
                </div>

                <div
                  className="bot-content-item list-content-item"
                  style={{ width: '26%' }}
                >
                  {_.product.productName}
                </div>

                <div className="bot-content-item list-content-item">
                  {_.category === 'normal' ? 'Normal' : 'VIP'}
                </div>

                <div className="bot-content-item list-content-item">
                  {_.status === 'complete'
                    ? 'Complete'
                    : _.status === 'processing'
                    ? 'Processing'
                    : 'Pending'}
                </div>

                <div className="user-content-item list-content-item">
                  {moment(_.createdAt)
                    .subtract(8, 'hours')
                    .format('YYYY-MM-DD HH:mm:ssA')}
                </div>
              </div>
            ))
          ) : (
            <p className="not-found">No Result Found</p>
          )}
        </div>

        {totalPage > 1 ? (
          <div className="pagination-wrapper">
            <div
              className={`pagination-item prev-btn ${
                offset === 0 ? 'disabled' : ''
              }`}
              onClick={() =>
                offset - 1 < 1 ? setOffset(0) : setOffset(offset - 1)
              }
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </div>

            <div className="current-page">{offset + 1}</div>

            <div
              className={`pagination-item next-btn ${
                offset + 1 >= totalPage ? 'disabled' : ''
              }`}
              onClick={() =>
                offset + 1 >= totalPage
                  ? setOffset(totalPage - 1)
                  : setOffset(offset + 1)
              }
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default Orders;
