import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import logo from '@assets/logo.png';
import '@styles/header.scss';
import $ from 'jquery';
import * as config from '@configs';
import * as utils from '@utils';
import * as authApi from '@api/auth';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faGear } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userData = utils.getCookie<{
    userId: string;
    name: string;
    email: string;
    role: 'admin' | 'customer';
    category: 'vip' | 'normal';
  }>('user_data');

  if (!userData) {
    window.location.href = '/login';
    return null;
  }

  const isAdmin = userData.role === 'admin';

  const menus = Object.entries(config.Path)
    .filter(([path]) => {
      if (/:\w+/.test(path)) return false;

      if (isAdmin) return path.startsWith('/admin');
      else return !path.startsWith('/admin');
    })
    .map(([path, name]) => ({ path, name }));

  const checkIsActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path ? ' active' : '';
    }

    return matchPath({ path, end: false }, location.pathname) ? ' active' : '';
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    $('.header-menu-wrapper').removeClass('active');
    $('.header-menu-wrapper-overlay').removeClass('active');
  };

  const handleLogOut = async () => {
    toast.loading('Logging you out...');
    try {
      await authApi.logout();
      utils.clearCookie();
      window.location.href = '/login';
    } catch (error) {
      window.location.href = '/login';
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div className="header">
      <div className="container">
        <div className="header-wrapper">
          <div className="title" onClick={() => navigate('/')}>
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
                Welcome, {userData.name}
                {isAdmin ? (
                  <FontAwesomeIcon icon={faGear} />
                ) : userData.category === 'vip' ? (
                  <FontAwesomeIcon icon={faCrown} />
                ) : (
                  ''
                )}
              </div>
              {menus
                .filter(menu => menu.name !== 'Home' && menu.name !== 'Login')
                .map((menu, index) => (
                  <div
                    key={index}
                    className={`header-menu-item${checkIsActive(menu.path)}`}
                    onClick={() => handleNavigate(menu.path)}
                  >
                    {menu.name}
                  </div>
                ))}
              <div className="header-menu-item" onClick={handleLogOut}>
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
