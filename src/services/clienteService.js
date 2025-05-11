import pool from "../config/db.js";
import { ClienteSchema } from "../types/schemas.js";
import { formatFechaRegistro } from "./tecnicoService.js";

/** @typedef {import("mysql2").QueryResult} QueryResult */
/** @typedef {import("mysql2").FieldPacket} FieldPacket */
/** @typedef {import("mysql2").ResultSetHeader} ResultSetHeader */

/** @typedef {import('../types').UpdateResult} UpdateResult */
/** @typedef {import('../types').DeleteResult} DeleteResult */

/** @typedef {import('../types').Cliente} Cliente */

/**
 *
 * @returns {Promise<Cliente[]>}
 */
export async function getAllClientes() {
  const [rows] = await pool.query("SELECT * FROM Cliente");
  //check if rows is an array
  const clientes =
    Array.isArray(rows) &&
    rows.map((row) => {
      const parsed = ClienteSchema.safeParse(row);
      if (!parsed.success) {
        throw new Error("El resultado no es un Cliente válido", {
          cause: parsed.error,
        });
      }
      return parsed.data;
    });
  return clientes;
}

/**
 * Obtiene un cliente por ID y valida el resultado.
 * @param {number} id
 * @returns {Promise<Cliente|null>}
 */
export async function getClienteById(id) {
  const [rows] = await pool.query("SELECT * FROM Cliente WHERE id = ?", [id]);
  const cliente = rows[0];
  if (!cliente) return null;

  const parsed = ClienteSchema.safeParse(cliente);
  if (!parsed.success) {
    throw new Error("El resultado no es un Cliente válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/**
 *
 * @param {Cliente} cliente
 * @returns {Promise<Cliente>}>}
 */
export async function createCliente(cliente) {
  const {
    id,
    usuarioId,
    nombre,
    apellido,
    telefono,
    direccion,
    fechaRegistro,
  } = cliente;
  
  // Formatear fechaRegistro a 'YYYY-MM-DD HH:mm:ss'
  const formattedFechaRegistro = formatFechaRegistro(fechaRegistro);
  
  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO Cliente (id, usuarioId, nombre, apellido, telefono, direccion, fechaRegistro) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, usuarioId, nombre, apellido, telefono, direccion, formattedFechaRegistro]
  );
  return {
    id: result.insertId,
    usuarioId,
    nombre,
    apellido,
    telefono,
    direccion,
    fechaRegistro,
  };
}

/**
 *
 * @param {number} id
 * @param {Cliente} cliente
 * @returns {Promise<UpdateResult>}
 */
export async function updateCliente(id, cliente) {
  const { nombre, apellido, telefono, direccion } = cliente;
  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query(
    "UPDATE Cliente SET nombre = ?, apellido = ?, telefono = ?, direccion = ? WHERE id = ?",
    [nombre, apellido, telefono, direccion, id]
  );
  const affectedRows = result.affectedRows;
  return { affectedRows };
}

/**
 * @param {number} id
 * @returns {Promise<DeleteResult>}
 
 */
export async function deleteCliente(id) {
  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query("DELETE FROM Cliente WHERE id = ?", [id]);
  const affectedRows = result.affectedRows;
  return { affectedRows };
}
