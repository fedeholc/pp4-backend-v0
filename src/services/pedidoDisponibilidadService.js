import pool from "../config/db.js";
import { PedidoDisponibilidadSchema } from "../types/schemas.js";

/** @typedef {import("mysql2").QueryResult} QueryResult */
/** @typedef {import("mysql2").FieldPacket} FieldPacket */
/** @typedef {import("mysql2").ResultSetHeader} ResultSetHeader */

/** @typedef {import('../types/index.ts').UpdateResult} UpdateResult */
/** @typedef {import('../types/index.ts').DeleteResult} DeleteResult */

/** @typedef {import('../types/index.ts').PedidoDisponibilidad} PedidoDisponibilidad */

/**
 * @returns {Promise<PedidoDisponibilidad[]>}
 */
export async function getAllPedidoDisponibilidad() {
  const rows = await pool.query("SELECT * FROM PedidoDisponibilidad");
  const disponibilidades = rows.map((row) => {
    const parsed = PedidoDisponibilidadSchema.safeParse(row);
    if (!parsed.success) {
      throw new Error("El resultado no es un PedidoDisponibilidad válido", {
        cause: parsed.error,
      });
    }
    return parsed.data;
  });
  return disponibilidades;
}

/**
 *
 * @param {number} id
 * @returns {Promise<PedidoDisponibilidad|null>}
 */
export async function getPedidoDisponibilidadById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM PedidoDisponibilidad WHERE id = ?",
    [id]
  );
  const disponibilidad = { ...(rows[0] || null) };
  if (!disponibilidad) return null;
  const parsed = PedidoDisponibilidadSchema.safeParse(disponibilidad);
  if (!parsed.success) {
    throw new Error("El resultado no es un PedidoDisponibilidad válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/**
 * @param {PedidoDisponibilidad} pedidoDisponibilidad
 * @returns {Promise<PedidoDisponibilidad>}
 */
export async function createPedidoDisponibilidad(pedidoDisponibilidad) {
  const { id, pedidoId, clienteId, dia, horaInicio, horaFin } =
    pedidoDisponibilidad;

  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO PedidoDisponibilidad (id, pedidoId, clienteId, dia, horaInicio, horaFin) VALUES (?, ?, ?, ?, ?, ?)",
    [id, pedidoId, clienteId, dia, horaInicio, horaFin]
  );
  // Validar la disponibilidad creada
  const parsed = PedidoDisponibilidadSchema.safeParse({
    id: result.insertId,
    pedidoId,
    clienteId,
    dia,
    horaInicio,
    horaFin,
  });
  if (!parsed.success) {
    throw new Error("El resultado no es un PedidoDisponibilidad válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/** 
 * @param {number} id
 * @param {PedidoDisponibilidad} data
 * @returns {Promise<UpdateResult>}

*/
export async function updatePedidoDisponibilidad(id, data) {
  const { pedidoId, clienteId, dia, horaInicio, horaFin } = data;
  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query(
    "UPDATE PedidoDisponibilidad SET pedidoId=?, clienteId=?, dia=?, horaInicio=?, horaFin=? WHERE id=?",
    [pedidoId, clienteId, dia, horaInicio, horaFin, id]
  );
  const affectedRows = result.affectedRows;
  return { affectedRows };
}

/**
 * @param {number} id
 * @returns {Promise<DeleteResult>}
 */
export async function deletePedidoDisponibilidad(id) {
  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query(
    "DELETE FROM PedidoDisponibilidad WHERE id = ?",
    [id]
  );
  const affectedRows = result.affectedRows;
  return { affectedRows };
}
