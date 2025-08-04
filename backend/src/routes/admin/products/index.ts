import * as express from 'express';
import { authenticateUser } from '@middlewares';
import * as productControllers from '@controllers/admin/products';

const router = express.Router({ mergeParams: true });

router.get('/', authenticateUser('admin'), productControllers.getProducts);

router.get(
  '/:productId',
  authenticateUser('admin'),
  productControllers.getProduct
);

export default router;
