// src/models/clientModel.js
import db from '../config/db.js';

export const ClientModel = {
  async findByPersonaId(personaId) {
    const { rows } = await db.query(
      'SELECT pk_cliente FROM cliente WHERE fk_persona = $1',
      [personaId]
    );
    return rows[0]?.pk_cliente || null;
  },

  async createFromPersona(personaId) {
    const { rows } = await db.query(
      `INSERT INTO cliente (fk_persona) VALUES ($1) RETURNING pk_cliente`,
      [personaId]
    );
    return rows[0].pk_cliente;
  },

  // azúcar: encuentra o crea
  async findOrCreateByPersona(personaId) {
    const existing = await this.findByPersonaId(personaId);
    if (existing) return existing;
    return this.createFromPersona(personaId);
  }
};

export default ClientModel;
