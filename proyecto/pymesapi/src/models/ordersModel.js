// src/models/ordersModel.js
import db from '../config/db.js';

/** Mapeo estados */
const STATUS_TEXT_BY_ID = {
  1: 'Pendiente',
  2: 'Preparando',
  3: 'Listo',
  4: 'Entregado',
  5: 'Cancelado',
};
const STATUS_ID_BY_TEXT = Object.fromEntries(
  Object.entries(STATUS_TEXT_BY_ID).map(([k, v]) => [v, Number(k)])
);

export const OrderModel = {
  // -------------------- Helpers --------------------

  /** Devuelve pk_cliente (valida o crea por fk_persona). */
  async _resolveClienteId(client, { clienteId, clientePersonaId }) {
    if (clienteId) {
      const ex = await client.query('SELECT 1 FROM cliente WHERE pk_cliente = $1', [clienteId]);
      if (!ex.rowCount) throw new Error(`clienteId ${clienteId} no existe en tabla cliente`);
      return clienteId;
    }
    if (!clientePersonaId) {
      throw new Error('clienteId (pk_cliente) o clientePersonaId (pk_persona) es requerido');
    }
    const r1 = await client.query(
      'SELECT pk_cliente FROM cliente WHERE fk_persona = $1',
      [clientePersonaId]
    );
    if (r1.rows[0]) return r1.rows[0].pk_cliente;

    const r2 = await client.query(
      'INSERT INTO cliente (fk_persona) VALUES ($1) RETURNING pk_cliente',
      [clientePersonaId]
    );
    return r2.rows[0].pk_cliente;
  },

  /**
   * Devuelve pk_trabajadores. Acepta:
   *  - vendedorId como pk_trabajadores
   *  - vendedorId como pk_persona (crea trabajador si existe persona)
   *  - vendedorPersonaId como pk_persona (crea trabajador si no existe)
   */
  async _resolveVendedorId(client, { vendedorId, vendedorPersonaId }) {
    if (vendedorId) {
      let r = await client.query(
        'SELECT pk_trabajadores FROM trabajadores WHERE pk_trabajadores = $1',
        [vendedorId]
      );
      if (r.rows[0]) return r.rows[0].pk_trabajadores;

      r = await client.query(
        'SELECT pk_trabajadores FROM trabajadores WHERE fk_persona = $1',
        [vendedorId]
      );
      if (r.rows[0]) return r.rows[0].pk_trabajadores;

      const p = await client.query(
        'SELECT pk_persona FROM personas WHERE pk_persona = $1',
        [vendedorId]
      );
      if (p.rows[0]) {
        const ins = await client.query(
          `INSERT INTO trabajadores (fk_persona, cargo, fecha_ingreso, activo)
           VALUES ($1, 'vendedor', NOW(), true)
           RETURNING pk_trabajadores`,
          [vendedorId]
        );
        return ins.rows[0].pk_trabajadores;
      }
      throw new Error(`vendedorId ${vendedorId} no existe ni como trabajador ni como persona`);
    }

    if (!vendedorPersonaId) {
      throw new Error('vendedorId (pk_trabajadores) o vendedorPersonaId (pk_persona) es requerido');
    }

    const r1 = await client.query(
      'SELECT pk_trabajadores FROM trabajadores WHERE fk_persona = $1',
      [vendedorPersonaId]
    );
    if (r1.rows[0]) return r1.rows[0].pk_trabajadores;

    const r2 = await client.query(
      `INSERT INTO trabajadores (fk_persona, cargo, fecha_ingreso, activo)
       VALUES ($1, 'vendedor', NOW(), true)
       RETURNING pk_trabajadores`,
      [vendedorPersonaId]
    );
    return r2.rows[0].pk_trabajadores;
  },

  /** Devuelve fk_persona dado pk_trabajadores. */
  async _personaIdFromTrabajador(client, trabajadorId) {
    const r = await client.query(
      'SELECT fk_persona FROM trabajadores WHERE pk_trabajadores = $1',
      [trabajadorId]
    );
    if (!r.rowCount) throw new Error(`Trabajador ${trabajadorId} no encontrado`);
    return r.rows[0].fk_persona;
  },

  /** Devuelve pk_moneda. Si no envías, usa primera; si no hay, autoseed. */
  async _resolveMonedaId(client, { monedaId }) {
    if (monedaId != null) {
      const r = await client.query('SELECT 1 FROM moneda WHERE pk_moneda = $1', [monedaId]);
      if (!r.rowCount) throw new Error(`monedaId ${monedaId} no existe en tabla moneda`);
      return monedaId;
    }

    const r2 = await client.query('SELECT pk_moneda FROM moneda ORDER BY pk_moneda ASC LIMIT 1');
    if (r2.rowCount) return r2.rows[0].pk_moneda;

    // Autoseed tolerante
    const colsSet = new Set(
      (await client.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema='public' AND table_name='moneda'
      `)).rows.map(r => r.column_name)
    );
    const cols = [];
    const vals = [];
    const ph   = [];
    const push = (name, val) => {
      cols.push(name);
      if (val === 'NOW()') ph.push('NOW()');
      else { vals.push(val); ph.push(`$${vals.length}`); }
    };

    if (colsSet.has('codigo'))     push('codigo', 'LOCAL');
    if (colsSet.has('nombre'))     push('nombre', 'Moneda Local');
    if (colsSet.has('simbolo'))    push('simbolo', '¤');
    if (colsSet.has('tasa'))       push('tasa', 1);
    if (colsSet.has('activo'))     push('activo', true);
    if (colsSet.has('created_at')) push('created_at', 'NOW()');

    if (cols.length) {
      await client.query(`INSERT INTO moneda (${cols.join(',')}) VALUES (${ph.join(',')})`, vals);
    } else {
      await client.query('INSERT INTO moneda DEFAULT VALUES');
    }

    const r3 = await client.query('SELECT pk_moneda FROM moneda ORDER BY pk_moneda ASC LIMIT 1');
    if (!r3.rowCount) throw new Error('No se pudo crear una moneda por defecto.');
    return r3.rows[0].pk_moneda;
  },

  /** Inserta en tiempo y retorna pk_tiempo. */
  async _createTiempo(client) {
    const { rows } = await client.query(
      `INSERT INTO tiempo (fecha, anio, mes, dia)
       VALUES (NOW(),
               EXTRACT(YEAR FROM NOW())::int,
               EXTRACT(MONTH FROM NOW())::int,
               EXTRACT(DAY FROM NOW())::int)
       RETURNING pk_tiempo;`
    );
    return rows[0].pk_tiempo;
  },

  /**
   * Registrar movimiento en movimientos_inventario (según tu esquema):
   * columnas: fk_inventario, tipo, cantidad, motivo, fk_persona, fk_tiempo, fk_session, creado_en
   */
  async _registrarMovimientoInventario(client, {
    inventarioId, tipo, cantidad, motivo,
    personaId, tiempoId, sessionId,
  }) {
    await client.query(
      `INSERT INTO movimientos_inventario
        (fk_inventario, tipo, cantidad, motivo, fk_persona, fk_tiempo, fk_session, creado_en)
       VALUES
        ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [inventarioId, tipo, cantidad, motivo || null, personaId, tiempoId, sessionId]
    );
  },

  // -------------------- Listado --------------------
  async getAll() {
    const q = `
      SELECT
        f.pk_factura AS id,
        p.pk_persona AS "customerId",
        p.nombre || ' ' || COALESCE(p.apellido, '') AS "customerName",
        f.total,
        COALESCE(f.created_at, NOW()) AS "createdAt",
        CASE f.estado
          WHEN 1 THEN 'Pendiente'
          WHEN 2 THEN 'Preparando'
          WHEN 3 THEN 'Listo'
          WHEN 4 THEN 'Entregado'
          ELSE 'Cancelado'
        END AS status
      FROM factura f
      JOIN cliente   c ON f.fk_cliente  = c.pk_cliente
      JOIN personas  p ON c.fk_persona  = p.pk_persona
      ORDER BY COALESCE(f.created_at, NOW()) DESC;
    `;
    const { rows } = await db.query(q);
    return rows;
  },

  // -------------------- Detalle --------------------
  async findById(id) {
    const q = `
      SELECT
        f.pk_factura AS id,
        p.nombre || ' ' || COALESCE(p.apellido, '') AS "customerName",
        f.total,
        COALESCE(f.created_at, NOW()) AS "createdAt",
        CASE f.estado
          WHEN 1 THEN 'Pendiente'
          WHEN 2 THEN 'Preparando'
          WHEN 3 THEN 'Listo'
          WHEN 4 THEN 'Entregado'
          ELSE 'Cancelado'
        END AS status,
        COALESCE(
          json_agg(
            json_build_object(
              'producto', i.producto,
              'cantidad', od.cantidad,
              'precio', od.precio_unitario,
              'total_linea', od.total_linea
            )
          ) FILTER (WHERE od.pk_orden IS NOT NULL),
          '[]'::json
        ) AS detalles
      FROM factura f
      JOIN cliente   c  ON f.fk_cliente     = c.pk_cliente
      JOIN personas  p  ON c.fk_persona     = p.pk_persona
      LEFT JOIN orden      od ON od.fk_factura    = f.pk_factura
      LEFT JOIN inventario i  ON od.fk_inventario = i.pk_inventario
      WHERE f.pk_factura = $1
      GROUP BY f.pk_factura, p.nombre, p.apellido;
    `;
    const { rows } = await db.query(q, [id]);
    return rows[0] || null;
  },

  // -------------------- Crear Orden --------------------
  /**
   * orderData: { clienteId?, clientePersonaId?, vendedorId?, vendedorPersonaId?, monedaId?, detalles:[{productoId,cantidad,precio}] }
   * sessionId: UUID de auth_sessions (req.user.sid)
   */
  async create(orderData, sessionId) {
    const {
      clienteId, clientePersonaId,
      vendedorId, vendedorPersonaId,
      detalles, monedaId,
    } = orderData;

    if (!sessionId) throw new Error('sessionId requerido para fk_session');
    if (!detalles || !detalles.length) {
      throw new Error('La orden debe tener al menos un producto');
    }

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const clientePk    = await this._resolveClienteId(client,  { clienteId,  clientePersonaId });
      const vendedorPk   = await this._resolveVendedorId(client, { vendedorId, vendedorPersonaId });
      const vendedorPers = await this._personaIdFromTrabajador(client, vendedorPk);
      const monedaPk     = await this._resolveMonedaId(client,   { monedaId });
      const tiempoId     = await this._createTiempo(client);

      // Bloquear y validar stock
      for (const item of detalles) {
        const { rows } = await client.query(
          'SELECT stock, producto FROM inventario WHERE pk_inventario = $1 FOR UPDATE',
          [item.productoId]
        );
        if (!rows.length) throw new Error(`Producto ID ${item.productoId} no encontrado`);
        if (rows[0].stock < item.cantidad) {
          throw new Error(`Stock insuficiente para el producto ${rows[0].producto}. Stock: ${rows[0].stock}, solicitado: ${item.cantidad}`);
        }
      }

      // Totales
      const IVA = 0.19;
      const subtotal = detalles.reduce((s, it) => s + it.precio * it.cantidad, 0);
      const impuesto = +(subtotal * IVA).toFixed(2);
      const total    = +(subtotal + impuesto).toFixed(2);

      // Insertar factura
      const fRes = await client.query(
        `
        INSERT INTO factura (
          fk_cliente, fk_vendedor, fk_moneda, fk_tiempo, fk_session,
          nro_factura, subtotal, impuesto, total, estado, created_at
        )
        VALUES (
          $1, $2, $3, $4, $5,
          'F-' || LPAD((CAST((SELECT COALESCE(MAX(pk_factura),0)+1 FROM factura) AS TEXT)), 6, '0'),
          $6, $7, $8, 1, NOW()
        )
        RETURNING pk_factura;
        `,
        [clientePk, vendedorPk, monedaPk, tiempoId, sessionId, subtotal, impuesto, total]
      );
      const facturaId = fRes.rows[0].pk_factura;

      // Detalles + descuento de stock + movimiento (SALIDA)
      for (const item of detalles) {
        await client.query(
          `INSERT INTO orden (fk_factura, fk_inventario, cantidad, precio_unitario, total_linea)
           VALUES ($1, $2, $3, $4, $5)`,
          [facturaId, item.productoId, item.cantidad, item.precio, item.cantidad * item.precio]
        );

        await client.query(
          'UPDATE inventario SET stock = stock - $1, actualizado_en = NOW() WHERE pk_inventario = $2',
          [item.cantidad, item.productoId]
        );

        await this._registrarMovimientoInventario(client, {
          inventarioId: item.productoId,
          tipo: 'SALIDA',
          cantidad: item.cantidad,          // positiva; el tipo indica salida
          motivo: 'Venta de productos',
          personaId: vendedorPers,
          tiempoId,
          sessionId,
        });
      }

      await client.query('COMMIT');
      return { id: facturaId, message: 'Orden creada exitosamente' };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  // -------------------- Cambiar estado --------------------
  async updateStatus(id, statusText) {
    const statusId = STATUS_ID_BY_TEXT[statusText];
    if (!statusId) throw new Error('Estado inválido');
    if (statusText === 'Cancelado') return this.cancelOrder(id);

    await db.query(
      `UPDATE factura SET estado = $1, updated_at = NOW() WHERE pk_factura = $2`,
      [statusId, id]
    );
    return this.findById(id);
  },

  // -------------------- Cancelar y devolver stock --------------------
  async cancelOrder(id) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const { rows: fRows } = await client.query(
        `SELECT f.estado, f.fk_session, t.fk_persona AS vendedor_persona
           FROM factura f
           JOIN trabajadores t ON t.pk_trabajadores = f.fk_vendedor
          WHERE f.pk_factura = $1
          FOR UPDATE`,
        [id]
      );
      if (!fRows.length) throw new Error('Orden no encontrada');
      if (fRows[0].estado === 5) throw new Error('La orden ya está cancelada');

      const vendedorPersona = fRows[0].vendedor_persona;
      const sessionId = fRows[0].fk_session;
      const tiempoId  = await this._createTiempo(client);

      const { rows: det } = await client.query(
        'SELECT fk_inventario, cantidad FROM orden WHERE fk_factura = $1',
        [id]
      );

      for (const d of det) {
        await client.query(
          'UPDATE inventario SET stock = stock + $1, actualizado_en = NOW() WHERE pk_inventario = $2',
          [d.cantidad, d.fk_inventario]
        );

        await this._registrarMovimientoInventario(client, {
          inventarioId: d.fk_inventario,
          tipo: 'ENTRADA',
          cantidad: d.cantidad,
          motivo: 'Cancelación de orden',
          personaId: vendedorPersona,
          tiempoId,
          sessionId,
        });
      }

      await client.query(
        'UPDATE factura SET estado = 5, updated_at = NOW() WHERE pk_factura = $1',
        [id]
      );

      await client.query('COMMIT');
      return this.findById(id);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  // -------------------- Consultar movimientos --------------------
  async getInventoryMovements(productoId = null) {
    let q = `
      SELECT 
        m.pk_movimiento AS id,
        i.producto,
        m.tipo,
        m.cantidad,
        m.motivo,
        m.creado_en,
        per.nombre || ' ' || COALESCE(per.apellido, '') AS actor
      FROM movimientos_inventario m
      JOIN inventario i ON m.fk_inventario = i.pk_inventario
      LEFT JOIN personas per ON per.pk_persona = m.fk_persona
      WHERE 1=1
    `;
    const params = [];
    if (productoId) {
      params.push(productoId);
      q += ` AND m.fk_inventario = $${params.length}`;
    }
    q += ' ORDER BY m.creado_en DESC';

    const { rows } = await db.query(q, params);
    return rows;
  },
};

export default OrderModel;
