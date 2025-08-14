import { API_BASE } from "./api"; // Asumiendo que tienes un archivo api.ts con la URL base

// === Definiciones de Tipos ===

// Tipo de dato simplificado que usa el frontend (la pantalla de pedidos)
export interface Order {
  id: string;
  product: string;     // Para simplificar, tomaremos el nombre del primer producto del pedido
  customerId: string;
  status: 'Pendiente' | 'Preparando' | 'Listo' | 'Entregado' | 'Cancelado';
}

// Tipo de dato completo como viene de la API (basado en el esquema de la BD)
interface OrderFromAPI {
  id: string;          // pk_factura
  product: string;     // nombre del producto desde la tabla inventario
  customerName: string;// nombre de la persona desde la tabla personas
  customerId: string;  // pk_persona del cliente
  status: 'Pendiente' | 'Preparando' | 'Listo' | 'Entregado' | 'Cancelado'; // estado de la factura
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

// Mapea el objeto complejo de la API al objeto simple que usa el frontend
function mapApiToOrder(apiOrder: OrderFromAPI): Order {
  return {
    id: apiOrder.id,
    product: apiOrder.product,
    customerId: apiOrder.customerId,
    status: apiOrder.status,
  };
}

// === Endpoints de la API ===

/**
 * Obtiene todos los pedidos desde el backend.
 */
export async function getOrders(): Promise<Order[]> {
  const url = `${API_BASE}/orders`; // Endpoint para obtener los pedidos
  
  const apiOrders: OrderFromAPI[] = await parseJsonOrThrow(
    await fetch(url),
    url
  );

  // Mapea cada pedido al formato que necesita el frontend
  return apiOrders.map(mapApiToOrder);
}

/**
 * Actualiza el estado de un pedido específico.
 * @param orderId - El ID del pedido a actualizar.
 * @param status - El nuevo estado del pedido.
 */
export async function updateOrderStatus(
  orderId: string, 
  status: Order['status']
): Promise<Order> {
  const url = `${API_BASE}/orders/${orderId}`;
  
  const payload = { status };

  const updatedApiOrder: OrderFromAPI = await parseJsonOrThrow(
    await fetch(url, {
      method: "PATCH", // PATCH es ideal para actualizaciones parciales
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
    url
  );

  return mapApiToOrder(updatedApiOrder);
}
