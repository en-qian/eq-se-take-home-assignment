import * as express from 'express';
import { authenticateUser } from '@middlewares';
import * as productControllers from '@controllers/customer/products';

const router = express.Router({ mergeParams: true });

router.get('/', authenticateUser('customer'), productControllers.getProducts);

router.get(
  '/:productId',
  authenticateUser('customer'),
  productControllers.getProduct
);

export default router;
