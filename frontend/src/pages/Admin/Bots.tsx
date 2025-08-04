import * as botApi from '@api/bots';
import LoadingScreen from '@components/LoadingScreen';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const PAGINATION_OFFSET = 10;

const Bots = () => {
  const [bots, setBots] = useState<botApi.BotDetails[]>([]);
  const [displayedItems, setDisplayedItems] = useState<botApi.BotDetails[]>([]);
  const [offset, setOffset] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const canAction = useRef(true);

  const getBots = async () => {
    try {
      const response = await botApi.getBots();

      setBots(response);
      setTotalPage(Math.ceil(response.length / PAGINATION_OFFSET));
      setDisplayedItems(response.slice(0, PAGINATION_OFFSET));
    } catch (error) {
      setBots([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBots();
  }, []);

  useEffect(() => {
    setDisplayedItems(
      bots.slice(
        offset * PAGINATION_OFFSET,
        offset * PAGINATION_OFFSET + PAGINATION_OFFSET
      )
    );
  }, [offset]);

  const handleBot = async (action: 'add' | 'remove') => {
    if (!canAction.current) return;

    canAction.current = false;

    const toastId = toast.loading(
      `${action === 'add' ? 'Adding' : 'Deleting'} bot...`
    );

    try {
      if (action === 'add') {
        await botApi.createBot();
      } else {
        await botApi.deleteNewestBot();
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(
        error.response?.data?.message ||
          'Unexpected Error. Please try again later.'
      );
    } finally {
      setTimeout(async () => {
        toast.dismiss(toastId);
        await getBots();
        canAction.current = true;
      }, 1000);
    }
  };

  return (
    <div className="bots page">
      <LoadingScreen isLoading={isLoading} />
      <div className="container">
        <div
          className="top-wrapper"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          <h1 style={{ margin: '0 auto 0 0' }}>Bots</h1>
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
            <div className="bots-header-item list-header-item">Status</div>
            <div className="bots-header-item list-header-item">Order Id</div>
            <div className="bots-header-item list-header-item">
              Order Category
            </div>
            <div className="bots-header-item list-header-item">
              Order Status
            </div>
            <div className="bots-header-item list-header-item">Product</div>
          </div>

          {displayedItems.length > 0 ? (
            displayedItems.map((_, index) => (
              <div key={index} className="bot-content list-content">
                <div className="bot-content-item list-content-item">
                  {index + 1}
                </div>

                <div className="bot-content-item list-content-item">
                  {_.status}
                </div>

                <div className="bot-content-item list-content-item">
                  {_.order ? _.order.orderRunningId : '-'}
                </div>

                <div className="bot-content-item list-content-item">
                  {_.order
                    ? _.order.orderCategory === 'normal'
                      ? 'Normal'
                      : 'VIP'
                    : '-'}
                </div>

                <div className="bot-content-item list-content-item">
                  {_.order
                    ? _.order.orderStatus === 'complete'
                      ? 'Complete'
                      : _.order.orderStatus === 'processing'
                      ? 'Processing'
                      : 'Pending'
                    : '-'}
                </div>

                <div className="user-content-item list-content-item">
                  {_.order ? _.order.productName : '-'}
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

export default Bots;
