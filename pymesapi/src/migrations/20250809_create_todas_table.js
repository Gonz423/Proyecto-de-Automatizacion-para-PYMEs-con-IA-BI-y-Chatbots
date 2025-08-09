import db from '../config/db.js';

export async function up() {
  try {
    // Paso 1: Crear tablas
    await db.query(`
      CREATE TABLE IF NOT EXISTS ubicacion (
        pk_ubicacion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        comuna VARCHAR(255),
        ciudad VARCHAR(255),
        calle VARCHAR(255),
        region VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS tiempo (
        pk_tiempo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        fecha TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS moneda (
        pk_moneda INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        cant_dinero FLOAT
      );

      CREATE TABLE IF NOT EXISTS personas (
        pk_persona INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        fk_ubicacion INTEGER,
        rut VARCHAR(255),
        rol VARCHAR(255),
        correo VARCHAR(255),
        password VARCHAR(255),
        nombre VARCHAR(255),
        apellido VARCHAR(255),
        fecha_nacimiento DATE,
        numero_telefono VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS inventario (
        pk_inventario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        fk_persona INTEGER,
        cantidad FLOAT,
        producto VARCHAR(255),
        categoria VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS cliente (
        pk_cliente INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        fk_persona INTEGER
      );

      CREATE TABLE IF NOT EXISTS trabajadores (
        pk_trabajadores INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        fk_persona INTEGER,
        cargo VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS factura (
        pk_factura INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        fk_cliente INTEGER,
        fk_inventario INTEGER,
        fk_moneda INTEGER,
        fk_tiempo INTEGER,
        nro_factura INTEGER
      );
    `);

    // Paso 2: Agregar claves foráneas
    await db.query(`
      ALTER TABLE personas 
        ADD CONSTRAINT fk_persona_ubicacion 
        FOREIGN KEY (fk_ubicacion) REFERENCES ubicacion(pk_ubicacion) ON DELETE SET NULL;

      ALTER TABLE inventario 
        ADD CONSTRAINT fk_inventario_persona 
        FOREIGN KEY (fk_persona) REFERENCES personas(pk_persona) ON DELETE CASCADE;

      ALTER TABLE cliente 
        ADD CONSTRAINT fk_cliente_persona 
        FOREIGN KEY (fk_persona) REFERENCES personas(pk_persona) ON DELETE CASCADE;

      ALTER TABLE trabajadores 
        ADD CONSTRAINT fk_trabajador_persona 
        FOREIGN KEY (fk_persona) REFERENCES personas(pk_persona) ON DELETE CASCADE;

      ALTER TABLE factura 
        ADD CONSTRAINT fk_factura_cliente 
        FOREIGN KEY (fk_cliente) REFERENCES cliente(pk_cliente) ON DELETE CASCADE;

      ALTER TABLE factura 
        ADD CONSTRAINT fk_factura_inventario 
        FOREIGN KEY (fk_inventario) REFERENCES inventario(pk_inventario) ON DELETE CASCADE;

      ALTER TABLE factura 
        ADD CONSTRAINT fk_factura_moneda 
        FOREIGN KEY (fk_moneda) REFERENCES moneda(pk_moneda) ON DELETE CASCADE;

      ALTER TABLE factura 
        ADD CONSTRAINT fk_factura_tiempo 
        FOREIGN KEY (fk_tiempo) REFERENCES tiempo(pk_tiempo) ON DELETE CASCADE;
    `);

    console.log('✅ Todas las tablas y sus referencias han sido creadas correctamente.');
  } catch (error) {
    console.error('❌ Error creando las tablas y referencias:', error);
  }
}

export async function down() {
  try {
    // Paso 1: Eliminar claves foráneas solo si existen
    await db.query(`
      ALTER TABLE personas DROP CONSTRAINT IF EXISTS fk_persona_ubicacion;
      ALTER TABLE inventario DROP CONSTRAINT IF EXISTS fk_inventario_persona;
      ALTER TABLE cliente DROP CONSTRAINT IF EXISTS fk_cliente_persona;
      ALTER TABLE trabajadores DROP CONSTRAINT IF EXISTS fk_trabajador_persona;
      ALTER TABLE factura DROP CONSTRAINT IF EXISTS fk_factura_cliente;
      ALTER TABLE factura DROP CONSTRAINT IF EXISTS fk_factura_inventario;
      ALTER TABLE factura DROP CONSTRAINT IF EXISTS fk_factura_moneda;
      ALTER TABLE factura DROP CONSTRAINT IF EXISTS fk_factura_tiempo;
    `);

    // Paso 2: Eliminar tablas en orden correcto
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

    console.log('✅ Todas las tablas y referencias eliminadas correctamente.');
  } catch (error) {
    console.error('❌ Error eliminando las tablas y referencias:', error);
  }
}

up()