import React, { useEffect, useState } from 'react';
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  matchPath,
} from 'react-router-dom';
import '@styles/global.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GeneralLayout from '@components/GeneralLayout';
import { Path } from '@configs';
import NotFound from '@pages/404';
import ScrollToTop from '@components/ScrollToTop';
import LoadingScreen from '@components/LoadingScreen';
import Login from '@pages/Login';
import * as authApi from '@api/auth';
import * as utils from '@utils';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  const isValid = Object.keys(Path).some(path => {
    return location.pathname === path || matchPath(path, location.pathname);
  });

  if (!isValid) return <NotFound />;

  useEffect(() => {
    const initialize = async () => {
      try {
        const userData = await authApi.initialize();

        utils.setCookie('user_data', userData);
      } catch (error) {
        navigate('/login');
      } finally {
        setIsComplete(true);
        setLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    <>
      <ScrollToTop />
      <ToastContainer limit={1} position={'top-center'} autoClose={1500} />
      <LoadingScreen isLoading={loading} />
      <Routes>
        <Route path="/admin/login" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="*" element={<GeneralLayout />}></Route>
      </Routes>
    </>
  );
};

export default App;
