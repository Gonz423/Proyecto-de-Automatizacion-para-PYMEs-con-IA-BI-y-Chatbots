// src/services/inventoryService.ts
import { API_BASE } from "./api";

interface InventoryItemFromAPI {
  pk_inventario: number;
  sku: string;
  producto: string;
  categoria: string;
  stock: number;
  precio_unitario: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  producto: string;
  categoria: string;
  stock: number;
  precio_unitario: number;
}

export class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

async function parseJsonOrThrow(res: Response, url: string) {
  const text = await res.text();
  if (!res.ok) {
    throw new HttpError(`HTTP ${res.status} — ${url} — ${text.slice(0, 200)}`, res.status);
  }
  return text ? JSON.parse(text) : null;
}

const map = (x: InventoryItemFromAPI): InventoryItem => ({
  id: String(x.pk_inventario),
  sku: x.sku,
  producto: x.producto,
  categoria: x.categoria,
  stock: x.stock,
  precio_unitario: x.precio_unitario,
});

export async function getInventory(token: string): Promise<InventoryItem[]> {
  const url = `${API_BASE}/inventory`;
  const rows: InventoryItemFromAPI[] = await parseJsonOrThrow(
    await fetch(url, { headers: { Authorization: `Bearer ${token}` } }),
    url
  );
  return rows.map(map);
}

export async function getInventoryItemById(token: string, id: string): Promise<InventoryItem> {
  const url = `${API_BASE}/inventory/${id}`;
  const row: InventoryItemFromAPI = await parseJsonOrThrow(
    await fetch(url, { headers: { Authorization: `Bearer ${token}` } }),
    url
  );
  return map(row);
}

export async function addInventoryItem(
  token: string,
  data: Omit<InventoryItem, "id">
): Promise<InventoryItem> {
  const url = `${API_BASE}/inventory`;
  const row: InventoryItemFromAPI = await parseJsonOrThrow(
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
    url
  );
  return map(row);
}

export async function updateInventoryItem(
  token: string,
  id: string,
  data: Partial<InventoryItem>
): Promise<InventoryItem> {
  const url = `${API_BASE}/inventory/${id}`;
  const row: InventoryItemFromAPI = await parseJsonOrThrow(
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
    url
  );
  return map(row);
}

export async function deleteInventoryItem(token: string, id: string): Promise<void> {
  const url = `${API_BASE}/inventory/${id}`;
  await parseJsonOrThrow(
    await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }),
    url
  );
}
