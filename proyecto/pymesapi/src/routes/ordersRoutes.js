import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} from '../services/ordersService.js';

const router = express.Router();

// GET /api/orders - Obtener todos los pedidos
router.get('/', async (req, res) => {
  try {
    const orders = await getOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pedidos', error: error.message });
  }
});

// GET /api/orders/:id - Obtener un pedido por su ID
router.get('/:id', async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    res.status(200).json(order);
  } catch (error) {
    // Si el servicio lanza el error "Pedido no encontrado", se devuelve un 404.
    res.status(404).json({ message: error.message });
  }
});

// POST /api/orders - Crear un nuevo pedido
router.post('/', async (req, res) => {
  try {
    const newOrder = await createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el pedido', error: error.message });
  }
});

// PUT /api/orders/:id - Actualizar un pedido existente
router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await updateOrder(req.params.id, req.body);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el pedido', error: error.message });
  }
});

// DELETE /api/orders/:id - Eliminar un pedido
router.delete('/:id', async (req, res) => {
  try {
    await deleteOrder(req.params.id);
    res.status(200).json({ message: 'Pedido eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el pedido', error: error.message });
  }
});

export default router;