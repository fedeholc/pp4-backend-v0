import pool from "../config/db.js";

export async function getAllPedidoDisponibilidad() {
  const [rows] = await pool.query("SELECT * FROM PedidoDisponibilidad");
  return rows;
}

export async function getPedidoDisponibilidadById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM PedidoDisponibilidad WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

export async function createPedidoDisponibilidad(data) {
  const { id, pedidoId, clienteId, dia, horaInicio, horaFin } = data;
  /** @type {[import("mysql2").ResultSetHeader, import("mysql2").FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO PedidoDisponibilidad (id, pedidoId, clienteId, dia, horaInicio, horaFin) VALUES (?, ?, ?, ?, ?, ?)",
    [id, pedidoId, clienteId, dia, horaInicio, horaFin]
  );
  data.id = result.insertId;
  return data;
}

export async function updatePedidoDisponibilidad(id, data) {
  const { pedidoId, clienteId, dia, horaInicio, horaFin } = data;
  await pool.query(
    "UPDATE PedidoDisponibilidad SET pedidoId=?, clienteId=?, dia=?, horaInicio=?, horaFin=? WHERE id=?",
    [pedidoId, clienteId, dia, horaInicio, horaFin, id]
  );
}

export async function deletePedidoDisponibilidad(id) {
  await pool.query("DELETE FROM PedidoDisponibilidad WHERE id = ?", [id]);
}
