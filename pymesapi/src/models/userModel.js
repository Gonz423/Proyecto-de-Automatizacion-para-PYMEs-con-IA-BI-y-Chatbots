import db from '../config/db.js';

export const UserModel = {
    async getAll(){
        const result = await db.query('SELECT * FROM users ORDER BY created_at DESC;');
        return result.rows;
        },

    async findById(id){
        const result = await db.query('SELECT * FROM users WHERE id = $1;', [id]);
        return result.rows[0];
},

    async create ({ name, email, password, celular }) {
        const result = await db.query(
            'INSERT INTO users (name, email, password, celular) VALUES ($1, $2, $3, $4) RETURNING *;',
            [name, email, password, celular]
        );
        return result.rows[0];
    },

    async update(id, { name, email, password, celular }) {
        const result = await db.query(
        'UPDATE users SET name = $1, email = $2, password = $3, celular = $4 WHERE id = $5 RETURNING *;',
        [name, email, password, celular, id]
        );
        return result.rows[0];
    },

    async delete(userId) {
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
        return result.rowCount;
    },
};

export default UserModel;