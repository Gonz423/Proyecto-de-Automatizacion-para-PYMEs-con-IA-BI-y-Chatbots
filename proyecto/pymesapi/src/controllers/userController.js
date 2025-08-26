// src/controllers/userController.js
import { userService } from '../services/userService.js';

export const userController = {
  async register(req, res) {
    try {
      // req.body debe incluir: { nombre, apellido, rut, correo, numero_telefono, password }
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      if (error.code === '23505') {
        // Unique violation PostgreSQL
        return res.status(409).json({ message: 'El correo electrónico o el RUT ya está en uso.' });
      }
      console.error('Error al registrar usuario:', error);
      res.status(500).json({ message: 'Error interno al registrar el usuario.' });
    }
  },

  async login(req, res) {
    try {
      // req.body: { correo, password }
      const result = await userService.loginUser(req.body);
      res.status(200).json(result); // -> { user, token, sessionId }
    } catch (error) {
      res.status(401).json({ message: error.message || 'Credenciales inválidas' });
    }
  },

  async verify(req, res) {
    try {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      if (!token) return res.status(401).json({ message: 'Falta token' });

      const { valid, payload } = await userService.verifyJwt(token);
      if (!valid) return res.status(401).json({ message: 'Token inválido' });

      res.json({ ok: true, sub: payload.sub, rol: payload.rol, sid: payload.sid });
    } catch (e) {
      res.status(500).json({ message: 'Error verificando token' });
    }
  },
};

export default userController;
