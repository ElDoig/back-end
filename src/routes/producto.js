import express from 'express';
import controller from '../controllers/producto.js'
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, controller.findAll);
router.get('/:id', controller.findOne);
router.post('/', controller.create);
router.put('/', controller.update);
router.delete('/:id', controller.remove);

export default router;