// src/services/api.ts
import { Platform } from "react-native";

// Lee la URL base COMPLETA desde las variables de entorno para producción.
const PRODUCTION_URL = process.env.EXPO_PUBLIC_API_BASE;

/**
 * Determina la URL base de la API según el entorno de ejecución.
 * - Si está definida la variable de entorno, la usa (ideal para producción).
 * - Si no, detecta la plataforma (Android, iOS) para usar el host de desarrollo correcto.
 */
function initializeApiUrl(): string {
  // Si la variable de producción está definida, esa es la que manda.
  if (PRODUCTION_URL) {
    console.log(`✅ Usando URL de producción: ${PRODUCTION_URL}`);
    return PRODUCTION_URL;
  }

  // Si no, estamos en desarrollo. Detectamos la plataforma para apuntar al backend local.
  const developmentHost = Platform.select({
    // IP especial del emulador de Android para acceder al 'localhost' de tu computadora.
    android: "http://10.0.2.2:3001",
    // En el simulador de iOS y en la web, 'localhost' funciona directamente.
    ios: "http://localhost:3001",
    default: "http://localhost:3001",
  });

  // En desarrollo, asumimos un prefijo /api. Ajusta si es diferente.
  const developmentUrl = `${developmentHost}/api`;
  console.log(`🛠️ Usando URL de desarrollo para ${Platform.OS}: ${developmentUrl}`);
  return developmentUrl;
}

// Exporta la URL base final para ser usada en toda la aplicación.
export const API_BASE = initializeApiUrl();
