import db from '../config/db.js';

export const InventoryModel = {
  /**
   * Obtiene todos los productos del inventario.
   */
  async getAll() {
    const result = await db.query('SELECT * FROM inventario ORDER BY producto ASC;');
    return result.rows;
  },

  /**
   * Busca un producto por su ID (pk_inventario).
   */
  async findById(id) {
    const result = await db.query('SELECT * FROM inventario WHERE pk_inventario = $1;', [id]);
    return result.rows[0];
  },

  /**
   * Crea un nuevo producto en el inventario.
   */
  async create({ fk_id_persona, sku, producto, categoria, stock, precio_unitario }) {
    const result = await db.query(
      `INSERT INTO inventario (fk_id_persona, sku, producto, categoria, stock, precio_unitario, creado_en, actualizado_en) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
       RETURNING *;`,
      [fk_id_persona, sku, producto, categoria, stock, precio_unitario]
    );
    return result.rows[0];
  },

  /**
   * Actualiza un producto existente en el inventario.
   */
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

  /**
   * Elimina un producto del inventario por su ID.
   */
  async delete(id) {
    const result = await db.query('DELETE FROM inventario WHERE pk_inventario = $1 RETURNING *;', [id]);
    return result.rowCount; // Devuelve 1 si se eliminó, 0 si no se encontró
  },
};

export default InventoryModel;
