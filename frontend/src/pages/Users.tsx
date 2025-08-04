import * as exampleApi from '@api/example';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Users = Awaited<ReturnType<typeof exampleApi.getUsers>>;

const PAGINATION_OFFSET = 5;

const Users = () => {
  const [users, setUsers] = useState<Users>([]);

  const [displayedItems, setDisplayedItems] = useState<Users>([]);
  const [offset, setOffset] = useState(0);
  const [totalPage, setTotalPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await exampleApi.getUsers();

        setUsers(response);
        setTotalPage(Math.ceil(response.length / PAGINATION_OFFSET));
        setDisplayedItems(response.slice(0, PAGINATION_OFFSET));
      } catch (error) {
        setUsers([]);
      }
    };

    getUsers();
  }, []);

  useEffect(() => {
    setDisplayedItems(
      users.slice(
        offset * PAGINATION_OFFSET,
        offset * PAGINATION_OFFSET + PAGINATION_OFFSET
      )
    );
  }, [offset]);

  return (
    <div className="users page">
      <div className="container">
        <h1>Users</h1>

        <div className="users-container list-container">
          <div className="users-header list-header">
            <div className="users-header-item list-header-item">No.</div>
            <div className="users-header-item list-header-item">Username</div>
            <div className="users-header-item list-header-item">Email</div>
            <div className="users-header-item list-header-item">Phone</div>
            <div className="users-header-item list-header-item">Company</div>
            <div className="users-header-item list-header-item"></div>
          </div>

          {displayedItems.length > 0 ? (
            displayedItems.map((_, index) => (
              <div key={index} className="user-content list-content">
                <div className="user-content-item list-content-item">
                  {index + 1}
                </div>

                <div className="user-content-item list-content-item">
                  {_.username}
                </div>

                <div className="user-content-item list-content-item">
                  {_.email}
                </div>

                <div className="user-content-item list-content-item">
                  {_.phone}
                </div>

                <div className="user-content-item list-content-item">
                  {_.company.bs}
                </div>

                <div className="user-content-item list-content-item">
                  <span
                    onClick={() => navigate(`/users/${_.id}`)}
                    className="view-details"
                  >
                    View
                  </span>
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

export default Users;
