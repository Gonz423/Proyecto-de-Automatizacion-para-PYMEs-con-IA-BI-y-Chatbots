// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Falta token.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, rol: payload.rol, sid: payload.sid };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

export default authMiddleware;
