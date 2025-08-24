import { API_BASE } from "./api"; // Asumiendo que tienes un archivo api.ts con la URL base

// === Definiciones de Tipos ===

export interface InventoryItem {
  id: string;
  sku: string;
  producto: string;
  categoria: string;
  stock: number;
  precio_unitario: number;
}

// Tipo para props de componentes de íconos
export interface FeatherProps {
  name: string;
  size: number;
  color: string;
  style?: object;
}

// === Error Custom ===
export class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

// === Helpers ===
async function parseJsonOrThrow(res: Response, url: string) {
  const text = await res.text();
  if (!res.ok) {
    throw new HttpError(`HTTP ${res.status} — ${url} — ${text.slice(0, 200)}`, res.status);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new HttpError(`Respuesta no-JSON — ${url} — ${text.slice(0, 200)}`, res.status);
  }
}

// === Endpoints de la API ===

/**
 * Obtiene todos los productos del inventario desde el backend.
 */
export async function getInventory(): Promise<InventoryItem[]> {
  const url = `${API_BASE}/inventory`; // Endpoint para el inventario
  
  const inventoryItems: InventoryItem[] = await parseJsonOrThrow(
    await fetch(url),
    url
  );

  // Asume que la API devuelve los datos en el formato correcto
  return inventoryItems;
}
