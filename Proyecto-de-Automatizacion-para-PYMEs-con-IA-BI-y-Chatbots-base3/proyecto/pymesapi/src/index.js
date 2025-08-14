import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Montamos todas las rutas de usuario bajo el prefijo /api/auth
// Esto hace que tu endpoint de login sea: POST /api/auth/login
app.use('/api/auth', userRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada', path: req.originalUrl });
});

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${port}`);
});
