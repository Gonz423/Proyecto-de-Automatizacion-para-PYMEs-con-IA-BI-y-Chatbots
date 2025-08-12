// src/services/userService.ts
import { API_BASE } from "./api";

// === Tipos (Fuente única de verdad) ===
export interface User {
  id?: number;
  correo: string;
  password_hash?: string;
  nombre: string;
  apellido: string;
  rut: string;
  numero_telefono: string;
  token?: string;
}

// Tipo para la respuesta que viene de la API
interface PersonaFromAPI {
  pk_persona?: number;
  nombre: string;
  apellido: string;
  rut: string;
  correo?: string; // Duplicado eliminado
  password_hash?: string;
  numero_telefono: string;
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

function mapPersonaToUser(p: PersonaFromAPI): User {
  return {
    id: p.pk_persona,
    nombre: p.nombre,
    apellido: p.apellido,
    rut: p.rut,
    correo: p.correo ?? "",
    password_hash: "", // Nunca guardamos la contraseña en el estado de la app
    numero_telefono: p.numero_telefono,
  };
}

// === Endpoints ===

export async function registerUser(newUser: User): Promise<User> {
  const url = `${API_BASE}/auth`; 
  
  // CORREGIDO: El payload ahora coincide con el modelo del backend (userModel.js)
  const payload = {
    nombre: newUser.nombre,
    correo: newUser.correo,
    password_hash: newUser.password_hash,
    numero_telefono: newUser.numero_telefono,
    apellido: newUser.apellido,
    rut: newUser.rut,
  };

  // El backend devuelve el usuario creado directamente
  const createdUser: PersonaFromAPI = await parseJsonOrThrow(
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    }),
    url
  );
  
  return mapPersonaToUser(createdUser);
}

export async function loginSmart(correo: string, password_hash: string): Promise<User> {
  const url = `${API_BASE}/auth/login`;

  const responseData = await parseJsonOrThrow(
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, password_hash }),
    }),
    url
  );

  // CORREGIDO: El backend devuelve 'nombre', no 'name'.
  return {
      token: responseData.token,
      id: responseData.user.id,
      nombre: responseData.user.nombre,
      correo: responseData.user.correo,
      apellido: '', // Estos campos no se devuelven en el login
      rut: '',
      numero_telefono: ''
  };
}
