import { useParams } from 'react-router-dom';
import * as exampleApi from '@api/example';
import { useEffect, useState } from 'react';
import LoadingScreen from '@components/LoadingScreen';
import NotFound from './404';

type User = Awaited<ReturnType<typeof exampleApi.getUser>>;

const User = () => {
  const { userId } = useParams();

  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  if (!userId) {
    return <NotFound />;
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await exampleApi.getUser(userId);

        setUser(response);

        setTimeout(() => setIsLoading(false), 500);
      } catch (error) {
        window.location.href = '/not-found';
      }
    };

    getUser();
  }, []);

  return (
    <div className="user page">
      <LoadingScreen isLoading={isLoading} />
      <div className="container">
        <h1>User Details</h1>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
};

export default User;
