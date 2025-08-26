// src/services/userService.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '12h';

export const userService = {
  // Registro: SIEMPRE recibe password en texto y guarda password_hash (bcrypt)
  async createUser(userData) {
    const { password, ...rest } = userData;
    if (!password) throw new Error('El campo "password" es requerido');
    const hashedPassword = await bcrypt.hash(password, 10);
    return UserModel.create({ ...rest, password_hash: hashedPassword });
  },

  // Login: recibe { correo, password } y compara con password_hash (bcrypt)
  async loginUser({ correo, password }) {
    if (!correo || !password) {
      console.warn('[loginUser] Falta correo o password');
      throw new Error('correo y password son requeridos');
    }

    const user = await UserModel.findByEmail(correo);
    if (!user) {
      console.warn('[loginUser] Usuario NO encontrado:', correo);
      throw new Error('Credenciales inválidas');
    }

    const hash = user.password_hash;
    if (!hash) {
      console.error('[loginUser] Usuario sin password_hash en DB:', user.pk_persona);
      throw new Error('Credenciales inválidas');
    }

    console.log('[loginUser] Comparando password para usuario:', correo);
    console.log('[loginUser] Hash en DB (prefix):', String(hash).slice(0, 7), 'len:', String(hash).length);

    const ok = await bcrypt.compare(password, hash);
    if (!ok) {
      console.warn('[loginUser] Password INCORRECTA para:', correo);
      throw new Error('Credenciales inválidas');
    }

    console.log('[loginUser] Login correcto para usuario:', correo);

    const sessionId = await UserModel.createSession(user.pk_persona);

    const token = jwt.sign(
      { sub: user.pk_persona, sid: sessionId, rol: user.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return {
      token,
      sessionId,
      user: { id: user.pk_persona, nombre: user.nombre, correo: user.correo },
    };
  },

  // Verificación de token para /auth/verify
  async verifyJwt(token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      return { valid: true, payload };
    } catch {
      return { valid: false };
    }
  },
};

export default userService;
