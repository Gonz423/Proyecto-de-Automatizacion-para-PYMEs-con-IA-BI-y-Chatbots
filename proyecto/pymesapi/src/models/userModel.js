// src/models/userModel.js
import db from '../config/db.js';

export const UserModel = {
  async findByEmail(correo) {
    const result = await db.query(
      'SELECT * FROM personas WHERE LOWER(correo) = LOWER($1) LIMIT 1;',
      [correo]
    );
    return result.rows[0];
  },

  async create({ nombre, apellido, rut, correo, password_hash, numero_telefono }) {
    const result = await db.query(
      `INSERT INTO personas (nombre, apellido, rut, correo, password_hash, numero_telefono, rol)
       VALUES ($1, $2, $3, $4, $5, $6, 'cliente')
       RETURNING pk_persona, nombre, correo;`,
      [nombre, apellido, rut, correo, password_hash, numero_telefono]
    );
    return result.rows[0];
  },

  // 🔧 FIX: insertar created_at, last_seen_at y expires_at
  async createSession(personaId) {
    const ttlHours = Number(process.env.SESSION_TTL_HOURS || 12);
    const result = await db.query(
      `INSERT INTO auth_sessions (fk_persona, created_at, last_seen_at, expires_at)
       VALUES ($1, NOW(), NOW(), NOW() + ($2 || ' hours')::interval)
       RETURNING session_id;`,
      [personaId, String(ttlHours)]
    );
    return result.rows[0].session_id;
  },

  // puedes actualizar last_seen_at cuando consultes la sesión
  async findSessionById(sessionId) {
    const result = await db.query(
      `SELECT p.pk_persona as id, p.rol
         FROM auth_sessions s
         JOIN personas p ON s.fk_persona = p.pk_persona
        WHERE s.session_id = $1
          AND s.revoked_at IS NULL
          AND s.expires_at > NOW();`,
      [sessionId]
    );
    // opcional: "tocar" la sesión
    if (result.rowCount > 0) {
      await db.query('UPDATE auth_sessions SET last_seen_at = NOW() WHERE session_id = $1', [sessionId]);
    }
    return result.rows[0];
  },

  async updatePasswordHash(personaId, newHash) {
    await db.query(
      'UPDATE personas SET password_hash = $2, updated_at = NOW() WHERE pk_persona = $1;',
      [personaId, newHash]
    );
  },
};

export default UserModel;
