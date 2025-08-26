// src/services/ordersService.ts
import { API_BASE } from "./api";

// === Tipos ===
export interface Order {
  id: string | number;
  customerName?: string;
  status: 'Pendiente' | 'Preparando' | 'Listo' | 'Entregado' | 'Cancelado' | string;
  total?: number;
  createdAt?: string;
  // opcional si tu /orders/:id devuelve líneas:
  detalles?: Array<{ producto: string; cantidad: number; precio: number; total_linea: number }>;
}

export interface NewOrderData {
  // puedes enviar UNO de estos pares; el backend resuelve:
  clienteId?: number;          // pk_cliente
  clientePersonaId?: number;   // pk_persona -> crea/usa cliente
  vendedorId?: number;         // pk_trabajadores
  vendedorPersonaId?: number;  // pk_persona -> crea/usa trabajador
  monedaId?: number;           // opcional
  detalles: Array<{
    productoId: number;        // pk_inventario
    cantidad: number;
    precio: number;
  }>;
}

// === Error custom ===
export class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

// === Helpers ===
function authHeaders(token?: string) {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function parseJsonOrThrow(res: Response, url: string) {
  const text = await res.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = null; }
  if (!res.ok) {
    const msg = (body && (body.message || body.error)) || `HTTP ${res.status}`;
    throw new HttpError(msg, res.status);
  }
  return body;
}

// === Endpoints ===

// Lista de órdenes (requiere token)
export async function getOrders(token: string): Promise<Order[]> {
  const url = `${API_BASE}/orders`;
  const list: Order[] = await parseJsonOrThrow(
    await fetch(url, { headers: authHeaders(token) }),
    url
  );
  return list;
}

// Detalle de una orden
export async function getOrderById(id: string, token?: string): Promise<Order> {
  const url = `${API_BASE}/orders/${id}`;
  const data: Order = await parseJsonOrThrow(
    await fetch(url, { headers: authHeaders(token) }),
    url
  );
  return data;
}

// Crear orden (token primero, luego payload)
export async function createOrder(token: string, orderData: NewOrderData): Promise<{ id: number } | Order> {
  const url = `${API_BASE}/orders`;
  const created = await parseJsonOrThrow(
    await fetch(url, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(orderData),
    }),
    url
  );
  return created;
}

// Cambiar estado de una orden
export async function updateOrderStatus(
  id: string,
  status: Order["status"],
  token?: string
): Promise<Order> {
  const url = `${API_BASE}/orders/${id}/status`;
  const updated: Order = await parseJsonOrThrow(
    await fetch(url, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify({ status }),
    }),
    url
  );
  return updated;
}

// Eliminar orden
export async function deleteOrder(id: string, token?: string): Promise<void> {
  const url = `${API_BASE}/orders/${id}`;
  await parseJsonOrThrow(
    await fetch(url, {
      method: "DELETE",
      headers: authHeaders(token),
    }),
    url
  );
}
