import db from '../config/db.js';

export const UserModel = {
    /**
     * Obtiene todos los registros de la tabla 'personas'.
     * @returns {Promise<any[]>} Una promesa que se resuelve con un array de personas.
     */
    async getAll() {
        // Se corrige el nombre de la tabla a 'personas'
        const result = await db.query('SELECT * FROM personas;');
        return result.rows;
    },

    /**
     * Busca una persona por su clave primaria.
     * @param {number} pk_persona El ID de la persona.
     * @returns {Promise<any | undefined>} Una promesa que se resuelve con el objeto de la persona o undefined.
     */
    async findById(pk_persona) {
        // Se corrige el nombre de la tabla y la columna de la clave primaria
        const result = await db.query('SELECT * FROM personas WHERE pk_persona = $1;', [pk_persona]);
        return result.rows[0];
    },

    /**
     * Crea un nuevo registro en la tabla 'personas' con todos los datos.
     * @param {{nombre: string, apellido: string, rut: string, correo: string, password: string, numero_telefono: string}} data Los datos de la nueva persona.
     * @returns {Promise<any>} Una promesa que se resuelve con el nuevo registro creado.
     */
    async create({ nombre, apellido, rut, correo, password, numero_telefono }) {
        // Se corrigen los nombres de la tabla y las columnas
        const result = await db.query(
            'INSERT INTO personas (nombre, apellido, rut, correo, password, numero_telefono) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
            [nombre, apellido, rut, correo, password, numero_telefono]
        );
        return result.rows[0];
    },

    /**
     * Actualiza un registro en la tabla 'personas'.
     * @param {number} pk_persona El ID de la persona a actualizar.
     * @param {{nombre: string, apellido: string, rut: string, correo: string, password: string, numero_telefono: string}} data Los nuevos datos.
     * @returns {Promise<any>} Una promesa que se resuelve con el registro actualizado.
     */
    async update(pk_persona, { nombre, apellido, rut, correo, password, numero_telefono }) {
        // Se corrigen los nombres de la tabla y las columnas
        const result = await db.query(
            'UPDATE personas SET nombre = $1, apellido = $2, rut = $3, correo = $4, password = $5, numero_telefono = $6 WHERE pk_persona = $7 RETURNING *;',
            [nombre, apellido, rut, correo, password, numero_telefono, pk_persona]
        );
        return result.rows[0];
    },

    /**
     * Elimina un registro de la tabla 'personas'.
     * @param {number} pk_persona El ID de la persona a eliminar.
     * @returns {Promise<number>} El número de filas eliminadas.
     */
    async delete(pk_persona) {
        // Se corrige el nombre de la tabla y la columna de la clave primaria
        const result = await db.query('DELETE FROM personas WHERE pk_persona = $1 RETURNING *', [pk_persona]);
        return result.rowCount;
    },
};

export default UserModel;