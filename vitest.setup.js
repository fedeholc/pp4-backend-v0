import mysql from "mysql2/promise";
import fs from "fs/promises";
import path from "path";
import pool from "./src/config/db.js"; // Importa el pool configurado
import dotenv from "dotenv";
import process from "node:process";

// Carga las variables de entorno. Vitest puede hacerlo automáticamente,
// pero ser explícito aquí asegura que se carguen antes de usar process.env.
// Asegúrate de que NODE_ENV=test esté configurado al ejecutar Vitest.
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "1234";
const DB_TEST_NAME = process.env.DB_TEST_NAME || "pp4_test";
const DB_CHARSET = process.env.DB_CHARSET || "utf8mb3";
const DB_COLLATION = process.env.DB_COLLATION || "utf8mb3_unicode_ci";

const schemaSqlPath = path.join(process.cwd(), "sql/db-schema.sql");
const seedsSqlPath = path.join(process.cwd(), "sql/db-seeds.sql");

async function executeSqlFile(filePath) {
  try {
    const sqlContent = await fs.readFile(filePath, "utf-8");
    if (sqlContent.trim()) {
      // El pool ya está configurado para DB_TEST_NAME y multipleStatements: true
      await pool.query(sqlContent);
      console.log(
        `Script SQL de ${filePath} ejecutado exitosamente en '${DB_TEST_NAME}'.`
      );
    } else {
      console.warn(`El script SQL ${filePath} estaba vacío o no se pudo leer.`);
    }
  } catch (error) {
    console.error(`Error ejecutando el script SQL ${filePath}:`, error);
    throw error; // Relanzar para que el setup falle
  }
}

async function setupTestDatabase() {
  let initialConnection;
  try {
    // Conectarse al servidor MySQL (sin especificar una base de datos) para crear la BD de prueba
    initialConnection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    // Crear la base de datos de prueba si no existe, con el charset y collation correctos
    await initialConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_TEST_NAME}\` CHARACTER SET ${DB_CHARSET} COLLATE ${DB_COLLATION};`
    );
    console.log(`Base de datos de prueba '${DB_TEST_NAME}' asegurada/creada.`);
    await initialConnection.end();

    // Ejecutar el script de esquema
    // Este script DEBE incluir los DROP TABLES para limpiar antes de crear.
    await executeSqlFile(schemaSqlPath);

    // Ejecutar el script de seeds
    await executeSqlFile(seedsSqlPath);
  } catch (error) {
    console.error(
      "Falló la configuración de la base de datos de prueba:",
      error
    );
    if (initialConnection) {
      await initialConnection.end();
    }
    process.exit(1); // Detiene la ejecución de los tests si el setup falla
  }
}

//   función `teardown` para limpiar después de todos los tests
export async function teardown() {
  if (pool) {
    await pool.end();
    console.log("Pool de conexiones de la base de datos de prueba cerrado.");
  }
}

// Vitest ejecutará este archivo. La llamada a setupTestDatabase() iniciará el proceso.
// La promesa devuelta por setupTestDatabase() será esperada por Vitest.
await setupTestDatabase();
