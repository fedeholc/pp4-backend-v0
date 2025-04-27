import pool from "../config/db.js";
import { TecnicoAreaSchema } from "../types/schemas.js";

/** @typedef {import("mysql2").QueryResult} QueryResult */
/** @typedef {import("mysql2").FieldPacket} FieldPacket */
/** @typedef {import("mysql2").ResultSetHeader} ResultSetHeader */

/** @typedef {import('../types/index.ts').TecnicoArea} TecnicoArea */

/**
 *
 * @returns {Promise<TecnicoArea[]>}
 */
export async function getAllTecnicoAreas() {
  const rows = await pool.query("SELECT * FROM TecnicoAreas");
  const tecnicoAreas = rows.map((row) => {
    const parsed = TecnicoAreaSchema.safeParse(row);
    if (!parsed.success) {
      throw new Error("El resultado no es un TecnicoArea válido", {
        cause: parsed.error,
      });
    }
    return parsed.data;
  });
  return tecnicoAreas;
}

/**
 *
 * @param {number} id
 * @returns {Promise<TecnicoArea|null>}
 */
export async function getTecnicoAreaById(id) {
  const [rows] = await pool.query("SELECT * FROM TecnicoAreas WHERE id = ?", [
    id,
  ]);
  const tecnicoArea = { ...(rows[0] || null) };
  if (!tecnicoArea) return null;
  const parsed = TecnicoAreaSchema.safeParse(tecnicoArea);
  if (!parsed.success) {
    throw new Error("El resultado no es un TecnicoArea válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/**
 *
 * @param {TecnicoArea} tecnicoArea
 * @returns {Promise<TecnicoArea>}
 */
export async function createTecnicoArea(tecnicoArea) {
  const { id, tecnicoId, areaId } = tecnicoArea;
  /** @type {[import("mysql2").ResultSetHeader, import("mysql2").FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO TecnicoAreas (id, tecnicoId, areaId) VALUES (?, ?, ?)",
    [id, tecnicoId, areaId]
  );
  // Validar el técnico-área creado
  const parsed = TecnicoAreaSchema.safeParse({
    id: result.insertId,
    tecnicoId,
    areaId,
  });
  if (!parsed.success) {
    throw new Error("El resultado no es un TecnicoArea válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/**
 * 
 * @param {number} id 
 * @param {TecnicoArea} tecnicoArea 
 * @returns {Promise<[QueryResult, FieldPacket[]]>}

 */
export async function updateTecnicoArea(id, tecnicoArea) {
  const { tecnicoId, areaId } = tecnicoArea;
  const result = await pool.query(
    "UPDATE TecnicoAreas SET tecnicoId = ?, areaId = ? WHERE id = ?",
    [tecnicoId, areaId, id]
  );
  return result;
}

export async function deleteTecnicoArea(id) {
  await pool.query("DELETE FROM TecnicoAreas WHERE id = ?", [id]);
}
