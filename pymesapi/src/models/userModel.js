import db from '../config/db.js';

export const UserModel = {
    async getAll() {
        const result = await db.query('SELECT pk_persona as id, nombre, apellido, correo as correo, numero_telefono as celular FROM personas ORDER BY nombre ASC;');
        return result.rows;
    },

    async findById(id) {
        const result = await db.query('SELECT * FROM personas WHERE pk_persona = $1;', [id]);
        return result.rows[0];
    },

    async findBycorreo(correo) {
        const result = await db.query('SELECT * FROM personas WHERE correo = $1;', [correo]);
        return result.rows[0];
    },

    // --- FUNCIÓN CORREGIDA ---
    // La lógica ahora coincide con el nuevo esquema de la BD, guardando session_id en la tabla 'personas'.
    async create({ nombre, correo, password_hash, numero_telefono, apellido, rut }) {
        // 1. Generar session_id con el formato solicitado.
        const randomFourDigits = Math.floor(1000 + Math.random() * 9000);
        // Asegurarse de que el RUT tenga al menos un carácter antes de cortarlo.
        const rutWithoutDV = rut && rut.length > 1 ? rut.slice(0, -1) : rut;
        const session_id = `${randomFourDigits}${rutWithoutDV}`;

        // 2. Insertar todos los datos en la tabla 'personas'.
        const rol = 'cliente';
        const is_active = true;
        
        // Se asume que fk_ubicacion puede ser NULL o se manejará de otra forma, por ahora no se inserta.
        try {
    await db.query('BEGIN'); // Inicia transacción

    // Insert en personas
    const result = await db.query(
        `INSERT INTO personas 
        (nombre, correo, password_hash, numero_telefono, apellido, rut, rol, is_active, session_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *;`,
        [nombre, correo, password_hash, numero_telefono, apellido, rut, rol, is_active, session_id]
    );

    // Insert en ubicacion usando el mismo session_id
    await db.query(
        `INSERT INTO ubicacion (session_id) VALUES ($1);`,
        [session_id]
    );

    await db.query('COMMIT'); // Confirma la transacción

    return result.rows[0];

} catch (error) {
    await db.query('ROLLBACK'); // Revierte si algo falla
    throw error;
}
    },

    // Se mantiene la función de actualizar como estaba, se puede ajustar si es necesario.
    async update(id, { nombre, correo, password_hash, numero_telefono, apellido, rut, rol, is_active }) {
        const result = await db.query(
            'UPDATE personas SET nombre = $1, correo = $2, password_hash = $3, numero_telefono = $4, apellido = $5, rut = $6, rol = $7, is_active = $8 WHERE pk_persona = $9 RETURNING *;',
            [nombre, correo, password_hash, numero_telefono, apellido, rut, rol, is_active, id]
        );
        return result.rows[0];
    },

    async delete(userId) {
        const result = await db.query('DELETE FROM personas WHERE pk_persona = $1 RETURNING *', [userId]);
        return result.rowCount;
    },
};

export default UserModel;
