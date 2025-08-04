import { useParams } from 'react-router-dom';
import * as orderApi from '@api/orders';
import * as productApi from '@api/products';
import { useEffect, useState } from 'react';
import NotFound from './404';
import * as utils from '@utils';
import LoadingScreen from '@components/LoadingScreen';
import { toast } from 'react-toastify';

const MenuInner = () => {
  const { menuId } = useParams();

  const [product, setProduct] = useState<productApi.ProductDetails>();
  const [isLoading, setIsLoading] = useState(true);

  if (!menuId) {
    return <NotFound />;
  }

  const role =
    utils.getCookie<{ role: 'admin' | 'customer' }>('user_data')?.role ===
    'admin'
      ? 'admin'
      : 'customer';

  let canOrder = true;

  const createOrder = async () => {
    if (!canOrder) return;

    canOrder = false;

    toast.loading('Creating your order...');

    try {
      await orderApi.createOrder(menuId);

      toast.dismiss();

      toast.success('Order created!', {
        onClose: () => {
          window.location.href = `/orders`;
        },
      });
    } catch (error: any) {
      toast.dismiss();
      toast.error(
        error.response?.data?.message ||
          'Unable to create order. Please try again later.'
      );

      canOrder = true;
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await productApi.getProduct(role)(menuId);

        setProduct(response);
      } catch (error) {
        setProduct(undefined);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    getProduct();
  }, []);

  if (!product) {
    return (
      <div>
        <LoadingScreen isLoading={isLoading} />
        <NotFound />
      </div>
    );
  }

  return (
    <div className="product-inner page">
      <LoadingScreen isLoading={isLoading} />
      <div className="container">
        <div className="product">
          <h1>{product.name}</h1>
          <div className="product-image-wrapper">
            <img src={product.image} />
          </div>
          <div className="product-content">
            <p className="product-description">{product.description}</p>
            <p className="product-price">RM {product.price.toFixed(2)}</p>
          </div>
          {role === 'customer' && (
            <div onClick={createOrder} className="add-to-order">
              Order
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuInner;
