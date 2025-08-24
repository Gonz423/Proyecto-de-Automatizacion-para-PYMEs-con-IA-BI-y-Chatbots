import db from '../config/db.js';

export const OrderModel = {
  /**
   * Obtiene todas las órdenes con información básica del cliente y del producto.
   */
  async getAll() {
    const query = `
      SELECT
        f.pk_factura AS id,
        p.pk_persona AS "customerId",
        p.nombre AS "customerName",
        f.estado AS status,
        (
          SELECT i.producto
          FROM factura_detalle fd
          JOIN inventario i ON fd.fk_inventario = i.pk_inventario
          WHERE fd.fk_factura = f.pk_factura
          LIMIT 1
        ) AS product
      FROM
        factura f
      JOIN
        personas p ON f.fk_cliente = p.pk_persona
      ORDER BY
        f.created_at DESC;
    `;
    const result = await db.query(query);
    return result.rows;
  },

  /**
   * Busca una orden específica por su ID.
   */
  async findById(id) {
    const query = `
      SELECT
        f.pk_factura AS id,
        p.pk_persona AS "customerId",
        p.nombre AS "customerName",
        f.estado AS status,
        (
          SELECT i.producto
          FROM factura_detalle fd
          JOIN inventario i ON fd.fk_inventario = i.pk_inventario
          WHERE fd.fk_factura = f.pk_factura
          LIMIT 1
        ) AS product
      FROM
        factura f
      JOIN
        personas p ON f.fk_cliente = p.pk_persona
      WHERE f.pk_factura = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  /**
   * Actualiza el estado de una orden.
   */
  async updateStatus(id, status) {
    const query = `
      UPDATE factura
      SET estado = $1
      WHERE pk_factura = $2
      RETURNING *;
    `;
    await db.query(query, [status, id]);
    // Devuelve la orden actualizada con toda la información
    return this.findById(id);
  },
};

export default OrderModel;
