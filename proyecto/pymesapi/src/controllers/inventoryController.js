// src/controllers/inventoryController.js
import inventoryService from '../services/inventoryService.js';

export const inventoryController = {
  async getAllItems(req, res) {
    try {
      if (!req.user?.id) return res.status(401).json({ message: 'No autenticado' });
      const items = await inventoryService.getAllItems(req.user.id);
      res.status(200).json(items);
    } catch (error) {
      console.error('[inventoryController.getAllItems] ', error);
      res.status(500).json({ message: 'Error al obtener el inventario.', error: error.message });
    }
  },

  async getItemById(req, res) {
    try {
      const { id } = req.params;
      const item = await inventoryService.getItemById(id);
      if (!item) return res.status(404).json({ message: 'Producto no encontrado' });
      if (item.fk_id_persona !== req.user.id) {
        return res.status(403).json({ message: 'Acceso denegado.' });
      }
      res.status(200).json(item);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async createItem(req, res) {
    try {
      if (!req.user?.id) return res.status(401).json({ message: 'No autenticado' });

      const itemData = {
        ...req.body,
        fk_id_persona: req.user.id,
      };

      const newItem = await inventoryService.createItem(itemData);
      res.status(201).json(newItem);
    } catch (error) {
      console.error('[inventoryController.createItem] ', error);
      res.status(500).json({ message: 'Error al crear el producto.', detail: error.message });
    }
  },

  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const item = await inventoryService.getItemById(id);
      if (!item) return res.status(404).json({ message: 'Producto no encontrado para actualizar' });
      if (item.fk_id_persona !== req.user.id) {
        return res.status(403).json({ message: 'No tienes permiso para actualizar este producto.' });
      }
      const updatedItem = await inventoryService.updateItem(id, req.body);
      res.status(200).json(updatedItem);
    } catch (error) {
      console.error('[inventoryController.updateItem] ', error);
      res.status(404).json({ message: error.message });
    }
  },

  async deleteItem(req, res) {
    try {
      const { id } = req.params;
      const item = await inventoryService.getItemById(id);
      if (!item) return res.status(404).json({ message: 'Producto no encontrado para eliminar' });
      if (item.fk_id_persona !== req.user.id) {
        return res.status(403).json({ message: 'No tienes permiso para eliminar este producto.' });
      }
      const result = await inventoryService.deleteItem(id);
      res.status(200).json(result);
    } catch (error) {
      console.error('[inventoryController.deleteItem] ', error);
      res.status(404).json({ message: error.message });
    }
  },
};

export default inventoryController;
