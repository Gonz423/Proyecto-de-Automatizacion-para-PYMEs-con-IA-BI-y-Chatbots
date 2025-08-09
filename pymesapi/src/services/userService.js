import userModel from '../models/userModel.js';

export const userService = {
    /**
     * Obtiene todos los usuarios.
     */
    async getAllusers() {
        return userModel.getAll();
    },

    /**
     * Obtiene un usuario por su ID.
     * @param {number} pk_persona - El ID de la persona.
     */
    async getuserById(pk_persona) {
        const user = await userModel.findById(pk_persona);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return user;
    },

    /**
     * Crea un nuevo usuario.
     * @param {object} newuser - El objeto con los datos del nuevo usuario.
     */
    async createuser(newuser) {
        // Se desestructuran los campos correctos que vienen del frontend.
        // Se mapea 'email' a 'correo' y 'numeroTelefono' a 'numero_telefono' para que coincidan con la DB.
        const { nombre, apellido, rut, email, password, numeroTelefono } = newuser;
        
        // Objeto con los datos mapeados y sanitizados para el modelo.
        const sanitizeduser = {
            nombre,
            apellido,
            rut,
            correo: email,
            password,
            numero_telefono: numeroTelefono
        };

        const createduser = await userModel.create(sanitizeduser);
        return { createduser };
    },

    /**
     * Actualiza un usuario.
     * @param {number} pk_persona - El ID de la persona a actualizar.
     * @param {object} newValues - Los nuevos valores.
     */
    async updateuser(pk_persona, newValues) {
        const updatedUser = await userModel.update(pk_persona, newValues);
        return { updatedUser };
    },

    /**
     * Elimina un usuario.
     * @param {number} pk_persona - El ID de la persona a eliminar.
     */
    async deleteuser(pk_persona) {
        const deletedCount = await userModel.delete(pk_persona);
        if (deletedCount === 0) {
            throw new Error('Usuario no encontrado para eliminar.');
        }
        return { message: 'Usuario eliminado exitosamente' };
    }
};

export default userService;