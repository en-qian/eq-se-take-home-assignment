import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Home from '@pages/Home';
import * as utils from '@utils';
import * as authApi from '@api/auth';
import Bots from '@pages/Admin/Bots';
import Menu from '@pages/Menu';
import MenuInner from '@pages/MenuInner';
import Orders from '@pages/Orders';

const GeneralLayout = () => {
  const navigate = useNavigate();

  const userData =
    utils.getCookie<Awaited<ReturnType<typeof authApi.initialize>>>(
      'user_data'
    );

  if (!userData) {
    navigate('/login');
    return null;
  }

  // const { setIsLoading } = props;

  // if (props.isComplete) {
  //   setIsLoading(false);
  // }

  return (
    <div className="general-layout">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu/:menuId" element={<MenuInner />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/orders" element={<Orders />} />

        <Route path="/admin" element={<Home />} />
        <Route path="/admin/bots" element={<Bots />} />
        <Route path="/admin/menu/:menuId" element={<MenuInner />} />
        <Route path="/admin/menu" element={<Menu />} />
        <Route path="/admin/orders" element={<Orders />} />
      </Routes>
    </div>
  );
};

export default GeneralLayout;
