// src/index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./config/db.js";

// Rutas
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/ordersRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";

// Si necesitas el middleware en index para rutas protegidas de nivel app, importa:
// import authMiddleware from "../middleware/authMiddleware.js"; // <- ojo con la ruta real

const app = express();
const port = process.env.PORT || 3001;

// Verificación de conexión a la BD
(async () => {
  try {
    await db.query("SELECT NOW()");
    console.log("🐘 Conexión con la base de datos establecida.");
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
    process.exit(1);
  }
})();

app.use(cors());

// 🔧 Parser tolerante: permite también valores primitivos (strings) y evita crashear.
// Si por accidente te llega un body como "eyJhbGciOi..." con Content-Type: application/json,
// no romperá el servidor (aunque la ruta no lo use).
app.use(express.json({ strict: false }));

// (Opcional) logging corto para depurar qué endpoint está recibiendo un body primitivo
app.use((req, _res, next) => {
  const isJson = (req.headers["content-type"] || "").includes("application/json");
  if (isJson && req.method !== "GET" && typeof req.body === "string") {
    console.warn("⚠️ Body JSON primitivo (string) recibido en", req.method, req.path);
  }
  next();
});

// Montaje de rutas
app.use("/api/auth", userRoutes);       // GET /api/auth/verify debe leer Authorization
app.use("/api/orders", orderRoutes);    // protegidas dentro del router si usas middleware
app.use("/api/inventory", inventoryRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada", path: req.originalUrl });
});

// 500
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo salió mal en el servidor." });
});

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
