import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import logo from '@assets/logo.png';
import '@styles/header.scss';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <div className="header">
      <div className="container">
        <div className="header-wrapper">
          <div className="title">
            <img
              style={{ width: '100%', maxWidth: '100px' }}
              src={logo}
              alt="site-logo"
            />
          </div>
          <div
            className="header-menu-wrapper-overlay"
            onClick={() => {
              $('.header-menu-wrapper').removeClass('active');
              $('.header-menu-wrapper-overlay').removeClass('active');
            }}
          ></div>
          <div className="header-menu-wrapper">
            <div className="header-menu-container">
              <div className="header-menu-item user-name">
                Welcome, Admin
                <FontAwesomeIcon icon={faGear} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
