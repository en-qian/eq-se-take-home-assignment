import '@styles/home.scss';
import { useState } from 'react';
import Bots from './Admin/Bots';
import Orders from './Orders';

const Home = () => {
  const [update, setUpdate] = useState(false);

  return (
    <div className="home page">
      <div className="container">
        <div className="dashboard">
          <div className="bot-area">
            <h2>Bot</h2>
            <Bots setUpdate={setUpdate} />
          </div>

          <div className="order-area">
            <h2>Orders</h2>
            <Orders update={update} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
