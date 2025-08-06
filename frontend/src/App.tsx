import React, { useEffect, useState } from 'react';
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  matchPath,
} from 'react-router-dom';
import '@styles/global.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GeneralLayout from '@components/GeneralLayout';
import { Path } from '@configs';
import NotFound from '@pages/404';
import ScrollToTop from '@components/ScrollToTop';
import LoadingScreen from '@components/LoadingScreen';

const App = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const isValid = Object.keys(Path).some(path => {
    return location.pathname === path || matchPath(path, location.pathname);
  });

  if (!isValid) return <NotFound />;

  return (
    <>
      <ScrollToTop />
      <ToastContainer limit={1} position={'top-center'} autoClose={1500} />
      <LoadingScreen isLoading={loading} />
      <Routes>
        <Route path="*" element={<GeneralLayout />}></Route>
      </Routes>
    </>
  );
};

export default App;
