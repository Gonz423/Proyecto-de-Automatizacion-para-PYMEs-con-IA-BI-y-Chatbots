// src/services/inventoryService.js
import inventoryModel from '../models/inventoryModel.js';

const inventoryService = {
  async getAllItems(personaId) {
    return inventoryModel.getAll(personaId); // ahora filtra por fk_id_persona
  },

  async getItemById(itemId) {
    const item = await inventoryModel.findById(itemId);
    if (!item) throw new Error('Producto no encontrado');
    return item;
  },

  async createItem(itemData) {
    return inventoryModel.create(itemData);
  },

  async updateItem(itemId, itemData) {
    const item = await inventoryModel.findById(itemId);
    if (!item) throw new Error('Producto no encontrado para actualizar');
    return inventoryModel.update(itemId, itemData);
  },

  async deleteItem(itemId) {
    const deleted = await inventoryModel.delete(itemId);
    if (deleted === 0) throw new Error('Producto no encontrado para eliminar');
    return { message: 'Producto eliminado exitosamente' };
  },
};

export default inventoryService;
