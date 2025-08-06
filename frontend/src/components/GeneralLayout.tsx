import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Home from '@pages/Home';

const GeneralLayout = () => {
  return (
    <div className="general-layout">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default GeneralLayout;
