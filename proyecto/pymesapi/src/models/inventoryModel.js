// src/models/inventoryModel.js
import db from '../config/db.js';

export const InventoryModel = {
  async getAll(personaId) {
    const result = await db.query(
      'SELECT * FROM inventario WHERE fk_id_persona = $1 ORDER BY producto ASC;',
      [personaId]
    );
    return result.rows;
  },

  async findById(id) {
    const result = await db.query('SELECT * FROM inventario WHERE pk_inventario = $1;', [id]);
    return result.rows[0];
  },

  async create({ fk_id_persona, sku, producto, categoria, stock, precio_unitario }) {
    const result = await db.query(
      `INSERT INTO inventario (fk_id_persona, sku, producto, categoria, stock, precio_unitario, creado_en, actualizado_en)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *;`,
      [fk_id_persona, sku, producto, categoria, stock, precio_unitario]
    );
    return result.rows[0];
  },

  async update(id, { sku, producto, categoria, stock, precio_unitario }) {
    const result = await db.query(
      `UPDATE inventario
         SET sku = $1, producto = $2, categoria = $3, stock = $4, precio_unitario = $5, actualizado_en = NOW()
       WHERE pk_inventario = $6
       RETURNING *;`,
      [sku, producto, categoria, stock, precio_unitario, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query('DELETE FROM inventario WHERE pk_inventario = $1 RETURNING *;', [id]);
    return result.rowCount;
  },
};

export default InventoryModel;
