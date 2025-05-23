/**
 * Configuración de la conexión a la base de datos MySQL.
 * @module config/db
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import process from "node:process";

dotenv.config();

const isTestEnvironment = process.env.NODE_ENV === "test";

const poolConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: isTestEnvironment
    ? process.env.DB_TEST_NAME || "pp4_test"
    : process.env.DB_NAME || "pp4",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (isTestEnvironment) {
  // Necesario para ejecutar el script SQL completo
  poolConfig.multipleStatements = true;
}

const pool = mysql.createPool(poolConfig);

export default pool;
