import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/ordersRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Monta las rutas de la API
app.use('/api/auth', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);

// Middleware para manejar rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada', path: req.originalUrl });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${port}`);
});