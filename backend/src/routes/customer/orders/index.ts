import * as express from 'express';
import { authenticateUser } from '@middlewares';
import * as orderControllers from '@controllers/customer/orders';

const router = express.Router({ mergeParams: true });

router.post('/', authenticateUser('customer'), orderControllers.createOrder);

router.get('/', authenticateUser('customer'), orderControllers.getOrders);

router.get(
  '/:orderId',
  authenticateUser('customer'),
  orderControllers.getOrder
);

export default router;
