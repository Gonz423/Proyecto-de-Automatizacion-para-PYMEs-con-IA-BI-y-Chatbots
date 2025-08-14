import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const userService = {
  async loginUser({ correo, password_hash }) {
    const user = await userModel.findBycorreo(correo);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Compara la contraseña en texto plano (NO RECOMENDADO PARA PRODUCCIÓN)
    const isMatch = (password_hash === user.password_hash);
    if (!isMatch) {
      throw new Error('Credenciales inválidas');
    }

    const payload = { id: user.pk_persona, correo: user.correo };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });

    return {
      token,
      user: {
        id: user.pk_persona,
        nombre: user.nombre, // CORREGIDO: usa 'nombre'
        correo: user.correo,
      },
    };
  },

  async createuser(newuser) {
    const createduser = await userModel.create(newuser);
    // Devuelve directamente el usuario creado, no anidado.
    return createduser;
  },

  async getAllusers() {
    return userModel.getAll();
  },

  async getuserById(userId) {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  },

  async updateuser(userId, newValues) {
    return userModel.update(userId, newValues);
  },

  async deleteuser(userId) {
    return userModel.delete(userId);
  }
};

export default userService;
