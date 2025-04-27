import pool from "../config/db.js";

export async function getAllClientes() {
  const [rows] = await pool.query("SELECT * FROM Cliente");
  return rows;
}

export async function getClienteById(id) {
  const [rows] = await pool.query("SELECT * FROM Cliente WHERE id = ?", [id]);
  return rows[0] || null;
}

export async function createCliente(cliente) {
  const { id, usuarioId, nombre, apellido, telefono, direccion } = cliente;
  /** @type {[import("mysql2").ResultSetHeader, import("mysql2").FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO Cliente (id, usuarioId, nombre, apellido, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?)",
    [id, usuarioId, nombre, apellido, telefono, direccion]
  );
  return { id: result.insertId, usuarioId, nombre, apellido, telefono, direccion };
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
