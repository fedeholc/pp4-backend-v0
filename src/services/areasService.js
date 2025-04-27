/**
 * Servicio para la entidad Areas.
 * @module services/areasService
 */
import pool from "../config/db.js";

/**
 * Obtiene todas las áreas.
 * @returns {Promise<import('mysql2').RowDataPacket[]>}
 */
export async function getAllAreas() {
  const [rows] = await pool.query("SELECT * FROM Areas");
  // Cast rows to the expected type, as pool.query can return different result types.
  return /** @type {import('mysql2').RowDataPacket[]} */ (rows);
}

/**
 * Crea un área nueva.
 * @param {Object} area
 * @returns {Promise<Object>}
 */
export async function createArea(area) {
  const { id, nombre, descripcion } = area;
  /** @type {[import("mysql2").ResultSetHeader, import("mysql2").FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO Areas (id, nombre, descripcion) VALUES (?, ?, ?)",
    [id, nombre, descripcion]
  );
  return { id: result.insertId, nombre, descripcion };
}

/**
 * Obtiene un área por ID.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
export async function getAreaById(id) {
  const [rows] = await pool.query("SELECT * FROM Areas WHERE id = ?", [id]);
  return rows[0] || null;
}

/**
 * Actualiza un área.
 * @param {number} id
 * @param {Object} area
 * @returns {Promise<void>}
 */
export async function updateArea(id, area) {
  const { nombre, descripcion } = area;
  await pool.query(
    "UPDATE Areas SET nombre = ?, descripcion = ? WHERE id = ?",
    [nombre, descripcion, id]
  );
}

/**
 * Elimina un área.
 * @param {number} id
 * @returns {Promise<boolean>}
 */
export async function deleteArea(id) {
  const [result] = await pool.query("DELETE FROM Areas WHERE id = ?", [id]);
  // Cast result to ResultSetHeader to access affectedRows
  return (
    /** @type {import('mysql2').ResultSetHeader} */ (result).affectedRows > 0
  );
}
