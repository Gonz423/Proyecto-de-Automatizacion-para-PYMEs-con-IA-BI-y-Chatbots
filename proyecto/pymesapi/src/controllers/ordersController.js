import orderService from '../services/orderService.js';

export const orderController = {
  /**
   * Obtiene todas las órdenes.
   */
  async getAllOrders(req, res) {
    try {
      const orders = await orderService.getOrders();
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
      res.status(500).json({ message: "Error al obtener las órdenes." });
    }
  },

  /**
   * Obtiene una orden específica por su ID.
   */
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(id);
      if (!order) {
        return res.status(404).json({ message: 'Orden no encontrada.' });
      }
      res.status(200).json(order);
    } catch (error) {
      console.error(`Error al obtener la orden ${req.params.id}:`, error);
      res.status(500).json({ message: 'Error al obtener la orden.' });
    }
  },

  /**
   * Actualiza el estado de una orden.
   */
  async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "El estado es requerido para la actualización." });
      }

      const updatedOrder = await orderService.updateOrderStatus(id, status);
      if (!updatedOrder) {
        return res.status(404).json({ message: 'La orden que intentas actualizar no fue encontrada.' });
      }
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error(`Error al actualizar la orden ${req.params.id}:`, error);
      res.status(500).json({ message: "Error al actualizar la orden." });
    }
  },
};

export default orderController;
