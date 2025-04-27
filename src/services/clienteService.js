import pool from "../config/db.js";
import { ClienteSchema } from "../types/schemas.js";

/** @typedef {import('../types/index.ts').Cliente} Cliente */

export async function getAllClientes() {
  const [rows] = await pool.query("SELECT * FROM Cliente");
  return rows;
}
 
/**
 * Obtiene un cliente por ID y valida el resultado.
 * @param {number} id
 * @returns {Promise<Cliente|null>}
 */
export async function getClienteById(id) {
  const [rows] = await pool.query("SELECT * FROM Cliente WHERE id = ?", [id]);
  const cliente = rows[0] || null;
  if (!cliente) return null;

  const parsed = ClienteSchema.safeParse(cliente);
  if (!parsed.success) {
    throw new Error("El resultado no es un Cliente válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

export async function createCliente(cliente) {
  const { id, usuarioId, nombre, apellido, telefono, direccion } = cliente;
  /** @type {[import("mysql2").ResultSetHeader, import("mysql2").FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO Cliente (id, usuarioId, nombre, apellido, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?)",
    [id, usuarioId, nombre, apellido, telefono, direccion]
  );
  return {
    id: result.insertId,
    usuarioId,
    nombre,
    apellido,
    telefono,
    direccion,
  };
}

export async function updateCliente(id, cliente) {
  const { nombre, apellido, telefono, direccion } = cliente;
  await pool.query(
    "UPDATE Cliente SET nombre = ?, apellido = ?, telefono = ?, direccion = ? WHERE id = ?",
    [nombre, apellido, telefono, direccion, id]
  );
}

export async function deleteCliente(id) {
  await pool.query("DELETE FROM Cliente WHERE id = ?", [id]);
}
