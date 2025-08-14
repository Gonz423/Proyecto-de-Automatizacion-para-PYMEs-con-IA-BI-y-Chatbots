import inventoryService from '../services/inventoryService.js';

export const inventoryController = {
  async getAllItems(req, res) {
    try {
      const items = await inventoryService.getAllItems();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el inventario.' });
    }
  },

  async getItemById(req, res) {
    try {
      const { id } = req.params;
      const item = await inventoryService.getItemById(id);
      res.status(200).json(item);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async createItem(req, res) {
    try {
      const newItem = await inventoryService.createItem(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el producto.' });
    }
  },

  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const updatedItem = await inventoryService.updateItem(id, req.body);
      res.status(200).json(updatedItem);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async deleteItem(req, res) {
    try {
      const { id } = req.params;
      const result = await inventoryService.deleteItem(id);
      res.status(200).json(result); // O res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
};

export default inventoryController;
