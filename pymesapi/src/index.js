import express from 'express';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Middleware para analizar el cuerpo de las solicitudes JSON
app.use(express.json());

// Middleware para CORS
app.use(cors());

// Rutas de la aplicación
app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
