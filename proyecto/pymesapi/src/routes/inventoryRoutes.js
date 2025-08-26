// src/routes/inventoryRoutes.js
import express from 'express';
import { inventoryController } from '../controllers/inventoryController.js';
import authMiddleware from '../../middleware/authMiddleware.js';
const router = express.Router();

// Aplica el middleware a todas las rutas de inventario
router.use(authMiddleware);

// Define las rutas
router.get('/', inventoryController.getAllItems);
router.post('/', inventoryController.createItem);
router.get('/:id', inventoryController.getItemById);
router.patch('/:id', inventoryController.updateItem);
router.delete('/:id', inventoryController.deleteItem);

export default router;