import * as express from 'express';
import { authenticateUser } from '@middlewares';
import * as botControllers from '@controllers/admin/bots';

const router = express.Router({ mergeParams: true });

router.post('/', authenticateUser('admin'), botControllers.createBot);

router.get('/', authenticateUser('admin'), botControllers.getBots);

router.get('/:botId', authenticateUser('admin'), botControllers.getBot);

router.delete(
  '/newest',
  authenticateUser('admin'),
  botControllers.deleteNewestBot
);

router.delete('/:botId', authenticateUser('admin'), botControllers.deleteBot);

export default router;
