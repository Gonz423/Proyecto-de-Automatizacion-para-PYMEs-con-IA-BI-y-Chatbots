import ordersModel from '../models/ordersModel.js';

export const orderController = {
  async getAllOrders(req, res) {
    try {
      const orders = await ordersModel.getAll();
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
      res.status(500).json({ message: "Error interno al obtener las órdenes." });
    }
  },

  async createOrder(req, res) {
    try {
      // ⬇️ el middleware agrega { id, rol, sid } desde el JWT
      const sessionId = req.user?.sid;
      if (!sessionId) {
        return res.status(401).json({ message: 'Sesión inválida (faltó sid en el token).' });
      }

      const orderData = req.body;
      if (!orderData.detalles || orderData.detalles.length === 0) {
        return res.status(400).json({ message: "La orden debe contener al menos un producto." });
      }

      // ⬇️ pasamos el sessionId al modelo
      const newOrder = await ordersModel.create(orderData, sessionId);
      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Error al crear la orden:", error);
      res.status(400).json({ message: "Error al crear la orden.", error: error.message });
    }
  },

  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await ordersModel.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Orden no encontrada.' });
      }
      res.status(200).json(order);
    } catch (error) {
      console.error(`Error al obtener la orden ${req.params.id}:`, error);
      res.status(500).json({ message: 'Error interno al obtener la orden.' });
    }
  },

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "El estado es requerido." });
      }
      const updatedOrder = await ordersModel.updateStatus(id, status);
      if (!updatedOrder) {
        return res.status(404).json({ message: 'La orden a actualizar no fue encontrada.' });
      }
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error(`Error al actualizar la orden ${req.params.id}:`, error);
      res.status(500).json({ message: "Error interno al actualizar la orden." });
    }
  },
};

export default orderController;
