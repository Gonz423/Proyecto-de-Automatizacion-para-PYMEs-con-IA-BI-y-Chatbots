import db from '../config/db.js';

export async function up() {
  try {
    await db.query(`
      -- Tabla para almacenar la información de ubicación
      CREATE TABLE ubicacion (
        pk_ubicacion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        comuna VARCHAR(255),
        ciudad VARCHAR(255),
        calle VARCHAR(255),
        region VARCHAR(255)
      );

      -- Tabla para almacenar los registros de tiempo
      CREATE TABLE tiempo (
        pk_tiempo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        fecha TIMESTAMP
      );

      -- Tabla para almacenar la información de moneda
      CREATE TABLE moneda (
        pk_moneda INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        cant_dinero FLOAT
      );

      -- Tabla principal para los datos de personas
      CREATE TABLE personas (
        pk_persona INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        fk_ubicacion INTEGER REFERENCES ubicacion(pk_ubicacion) ON DELETE SET NULL,
        rut VARCHAR(255),
        rol VARCHAR(255),
        correo VARCHAR(255),
        password VARCHAR(255),
        nombre VARCHAR(255),
        apellido VARCHAR(255),
        fecha_nacimiento DATE,
        numero_telefono VARCHAR(255)
      );

      -- Tabla para almacenar el inventario de cada persona
      CREATE TABLE inventario (
        pk_inventario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        fk_id_persona INTEGER REFERENCES personas(pk_persona) ON DELETE CASCADE,
        cantidad FLOAT,
        producto VARCHAR(255),
        categoria VARCHAR(255)
      );

      -- Tabla para los clientes, referenciando a la tabla de personas
      CREATE TABLE cliente (
        pk_cliente INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        fk_persona INTEGER REFERENCES personas(pk_persona) ON DELETE CASCADE
      );

      -- Tabla para los trabajadores, referenciando a la tabla de personas
      CREATE TABLE trabajadores (
        pk_trabajadores INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        fk_persona INTEGER REFERENCES personas(pk_persona) ON DELETE CASCADE,
        cargo VARCHAR(255)
      );

      -- Tabla para las facturas, con claves foráneas a otras tablas
      CREATE TABLE factura (
        pk_factura INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        fk_cliente INTEGER REFERENCES cliente(pk_cliente) ON DELETE CASCADE,
        fk_inventario INTEGER REFERENCES inventario(pk_inventario) ON DELETE CASCADE,
        fk_moneda INTEGER REFERENCES moneda(pk_moneda) ON DELETE CASCADE,
        fk_tiempo INTEGER REFERENCES tiempo(pk_tiempo) ON DELETE CASCADE,
        nro_factura INTEGER
      );
    `);

    console.log('Todas las tablas creadas correctamente.');
  } catch (error) {
    console.error('Error creando las tablas:', error);
  }
}


export async function down() {
  try {
    // Se eliminan las tablas en el orden correcto para evitar problemas con las claves foráneas.
    await db.query(`
      DROP TABLE IF EXISTS factura;
      DROP TABLE IF EXISTS trabajadores;
      DROP TABLE IF EXISTS cliente;
      DROP TABLE IF EXISTS inventario;
      DROP TABLE IF EXISTS personas;
      DROP TABLE IF EXISTS moneda;
      DROP TABLE IF EXISTS tiempo;
      DROP TABLE IF EXISTS ubicacion;
    `);

    console.log('Todas las tablas eliminadas correctamente.');
  } catch (error) {
    console.error('Error eliminando las tablas:', error);
  }
}

up();