// src/services/userService.ts
import { API_BASE } from "./api";

export interface User {
  id: number | string;
  nombre: string;
  correo: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

async function parseJsonOrThrow(resp: Response, url: string) {
  const raw = await resp.text();
  let data: any = {};
  try { data = raw ? JSON.parse(raw) : {}; } catch {
    const err = new Error(`Respuesta no válida de ${url} (JSON inválido)`); (err as any).status = resp.status; throw err;
  }
  if (!resp.ok) { const message = data?.message || data?.error || resp.statusText; const err = new Error(message); (err as any).status = resp.status; (err as any).data = data; throw err; }
  return data;
}

export async function loginSmart(correo: string, password: string): Promise<LoginResponse> {
  const url = `${API_BASE}/auth/login`;
  const responseData = await parseJsonOrThrow(
    await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ correo, password }) }),
    url
  );
  const apiUser = responseData?.user ?? responseData;
  if (!apiUser || !responseData?.token) throw new Error("La respuesta del servidor no contiene usuario y/o token.");
  return { user: { id: apiUser.id, nombre: apiUser.nombre, correo: apiUser.correo }, token: String(responseData.token) };
}

export async function register(payload: {
  nombre: string;
  apellido: string;
  rut: string;
  correo: string;
  numero_telefono?: string;
  password: string; // 👈 siempre password, no password_hash
}) {
  const url = `${API_BASE}/auth/register`;
  return parseJsonOrThrow(
    await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }),
    url
  );
}

export function authHeader(token: string) { return { Authorization: `Bearer ${token}` }; }
