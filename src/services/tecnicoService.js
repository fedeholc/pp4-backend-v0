import pool from "../config/db.js";
import { TecnicoSchema } from "../types/schemas.js";

/** @typedef {import('../types/index.js').Tecnico} Tecnico */
/** @typedef {import("mysql2").QueryResult} QueryResult */
/** @typedef {import("mysql2").FieldPacket} FieldPacket */
/** @typedef {import("mysql2").ResultSetHeader} ResultSetHeader */

/**
 *
 * @returns {Promise<Tecnico[]>}
 */
export async function getAllTecnicos() {
  const rows = await pool.query("SELECT * FROM Tecnico");
  const tecnicos = rows.map((row) => {
    const parsed = TecnicoSchema.safeParse(row);
    if (!parsed.success) {
      throw new Error("El resultado no es un Tecnico válido", {
        cause: parsed.error,
      });
    }
    return parsed.data;
  });
  return tecnicos;
}

/**
 *
 * @param {number} id
 * @returns {Promise<Tecnico|null>}
 */
export async function getTecnicoById(id) {
  const [rows] = await pool.query("SELECT * FROM Tecnico WHERE id = ?", [id]);
  const tecnico = { ...(rows[0] || null) };
  if (!tecnico) return null;
  const parsed = TecnicoSchema.safeParse(tecnico);
  if (!parsed.success) {
    throw new Error("El resultado no es un Tecnico válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/**
 * 
 * @param {Tecnico} tecnico 
 * @returns {Promise<Tecnico>}
 */
export async function createTecnico(tecnico) {
  const {
    id,
    usuarioId,
    nombre,
    apellido,
    telefono,
    direccion,
    caracteristicas,
  } = tecnico;

  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO Tecnico (id, usuarioId, nombre, apellido, telefono, direccion, caracteristicas) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, usuarioId, nombre, apellido, telefono, direccion, caracteristicas]
  );
  // Validar el técnico creado
  const parsed = TecnicoSchema.safeParse({
    id: result.insertId,
    usuarioId,
    nombre,
    apellido,
    telefono,
    direccion,
    caracteristicas,
  });
  if (!parsed.success) {
    throw new Error("El resultado no es un Tecnico válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/**
 * 
 * @param {number} id 
 * @param {Tecnico} tecnico 
 * @returns {Promise<[QueryResult, FieldPacket[]]>}
 */
export async function updateTecnico(id, tecnico) {
  const { nombre, apellido, telefono, direccion, caracteristicas } = tecnico;
  const result = await pool.query(
    "UPDATE Tecnico SET nombre = ?, apellido = ?, telefono = ?, direccion = ?, caracteristicas = ? WHERE id = ?",
    [nombre, apellido, telefono, direccion, caracteristicas, id]
  );
  return result;
}

/**
 * @param {number} id
 * @returns {Promise<[QueryResult, FieldPacket[]]>}
 */
export async function deleteTecnico(id) {
  const result = await pool.query("DELETE FROM Tecnico WHERE id = ?", [id]);
  return result;
}
