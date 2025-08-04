import '@styles/home.scss';
import * as productApi from '@api/products';
import { useEffect, useState } from 'react';
import * as utils from '@utils';
import LoadingScreen from '@components/LoadingScreen';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const [products, setProducts] = useState<productApi.ProductDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const role =
    utils.getCookie<{ role: 'admin' | 'customer' }>('user_data')?.role ===
    'admin'
      ? 'admin'
      : 'customer';

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await productApi.getProducts(role)();

        setProducts(response);
      } catch (error) {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    getProducts();
  }, []);

  return (
    <div className="home page">
      <LoadingScreen isLoading={isLoading} />
      <div className="container">
        <div className="top-products">
          <h2>Menu</h2>
          <div className="top-products-container">
            {products.map((product, index) => (
              <div
                key={index}
                className="top-product"
                onClick={() =>
                  navigate(
                    `${role === 'admin' ? '/admin' : ''}/menu/${
                      product.productId
                    }`
                  )
                }
              >
                <div className="top-product-image-wrapper">
                  <img src={product.image} alt="product-image" />
                </div>
                <div className="top-product-description">
                  <p>{product.name}</p>
                  <p>RM {product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
