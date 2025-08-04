import * as express from 'express';
import adminRouter from './admin';
import authRouter from './auth';
import customerRouter from './customer';

const router = express.Router({ mergeParams: true });

router.use('/admin', adminRouter);
router.use('/auth', authRouter);
router.use('/customer', customerRouter);

export default router;
