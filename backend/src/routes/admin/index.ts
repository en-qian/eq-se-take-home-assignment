import * as express from 'express';

import botRouter from './bots';
import orderRouter from './orders';
import productRouter from './products';

const router = express.Router({ mergeParams: true });

router.use('/bots', botRouter);
router.use('/orders', orderRouter);
router.use('/products', productRouter);

export default router;
