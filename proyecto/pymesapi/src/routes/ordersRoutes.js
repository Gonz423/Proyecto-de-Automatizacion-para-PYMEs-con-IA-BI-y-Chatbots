import express from 'express';
import { orderController } from '../controllers/ordersController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Protegemos TODAS las rutas de órdenes para tener req.user.sid
router.use(authMiddleware);

router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', orderController.updateOrderStatus);

export default router;
