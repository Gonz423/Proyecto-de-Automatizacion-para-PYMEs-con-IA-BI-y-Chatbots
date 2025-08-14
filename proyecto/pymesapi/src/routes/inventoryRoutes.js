import { Router } from 'express';
import inventoryController from '../controllers/inventoryController.js';

const router = Router();

// Rutas para el CRUD de Inventario
router.get('/', inventoryController.getAllItems);
router.post('/', inventoryController.createItem);
router.get('/:id', inventoryController.getItemById);
router.patch('/:id', inventoryController.updateItem); // Se usa PATCH para actualizaciones parciales
router.delete('/:id', inventoryController.deleteItem);

export default router;
