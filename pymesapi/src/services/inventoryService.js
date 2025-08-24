import inventoryModel from '../models/inventoryModel.js';

const inventoryService = {
  async getAllItems() {
    return inventoryModel.getAll();
  },

  async getItemById(itemId) {
    const item = await inventoryModel.findById(itemId);
    if (!item) {
      throw new Error('Producto no encontrado');
    }
    return item;
  },

  async createItem(itemData) {
    // Aquí se podría añadir validación de datos antes de crear
    return inventoryModel.create(itemData);
  },

  async updateItem(itemId, itemData) {
    const item = await inventoryModel.findById(itemId);
    if (!item) {
      throw new Error('Producto no encontrado para actualizar');
    }
    return inventoryModel.update(itemId, itemData);
  },

  async deleteItem(itemId) {
    const deletedCount = await inventoryModel.delete(itemId);
    if (deletedCount === 0) {
      throw new Error('Producto no encontrado para eliminar');
    }
    return { message: 'Producto eliminado exitosamente' };
  },
};

export default inventoryService;
