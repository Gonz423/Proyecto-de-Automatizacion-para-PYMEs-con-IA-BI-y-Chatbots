import express from 'express';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors'; // Importa el middleware de CORS

const app = express();
const port = process.env.PORT || 3000;

// Agrega el middleware de CORS para permitir solicitudes de origen cruzado
app.use(cors());

app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});