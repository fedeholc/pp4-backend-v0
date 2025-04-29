import pool from "../config/db.js";
import { AreaSchema } from "../types/schemas.js";

/** @typedef {import('../types').Area} Area */
/** @typedef {import("mysql2").QueryResult} QueryResult */
/** @typedef {import("mysql2").FieldPacket} FieldPacket */
/** @typedef {import("mysql2").ResultSetHeader} ResultSetHeader */

/** @typedef {import('../types').UpdateResult} UpdateResult */
/** @typedef {import('../types').DeleteResult} DeleteResult */

/**
 * Obtiene todas las áreas.
 * @returns {Promise<Area[]>}
 */
export async function getAllAreas() {
  const [rows] = await pool.query("SELECT * FROM Areas");
  const areas =
    Array.isArray(rows) &&
    rows.map((row) => {
      const parsed = AreaSchema.safeParse(row);
      if (!parsed.success) {
        throw new Error("El resultado no es un Area válido", {
          cause: parsed.error,
        });
      }
      return parsed.data;
    });
  return areas;
}

/**
 * Crea un área nueva.
 * @param {Area} area
 * @returns {Promise<Area>}
 */
export async function createArea(area) {
  const { id, nombre, descripcion } = area;
  /** @type {[ResultSetHeader, FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO Areas (id, nombre, descripcion) VALUES (?, ?, ?)",
    [id, nombre, descripcion]
  );
  // Validar el área creada
  const parsed = AreaSchema.safeParse({
    id: result.insertId,
    nombre,
    descripcion,
  });
  if (!parsed.success) {
    throw new Error("El resultado no es un Area válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/**
 * Obtiene un área por ID.
 * @param {number} id
 * @returns {Promise<Area|null>}
 */
export async function getAreaById(id) {
  const [rows] = await pool.query("SELECT * FROM Areas WHERE id = ?", [id]);
  const area = { ...(rows[0] || null) };
  if (!area) return null;
  const parsed = AreaSchema.safeParse(area);
  if (!parsed.success) {
    throw new Error("El resultado no es un Area válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
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
 * @param {number} id
 * @returns {Promise<DeleteResult>}
 */
export async function deleteArea(id) {
  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query("DELETE FROM Areas WHERE id = ?", [id]);
  // Cast result to ResultSetHeader to access affectedRows
  const affectedRows = result.affectedRows;
  return { affectedRows };
}
