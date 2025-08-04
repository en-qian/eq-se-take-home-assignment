import * as express from 'express';
import { authenticateUser } from '@middlewares';
import * as orderControllers from '@controllers/admin/orders';

const router = express.Router({ mergeParams: true });

router.get('/', authenticateUser('admin'), orderControllers.getOrders);

router.get('/:orderId', authenticateUser('admin'), orderControllers.getOrder);

export default router;
