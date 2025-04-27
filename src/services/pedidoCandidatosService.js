import pool from "../config/db.js";

export async function getAllPedidoCandidatos() {
  const [rows] = await pool.query("SELECT * FROM PedidoCandidatos");
  return rows;
}

export async function getPedidoCandidatosById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM PedidoCandidatos WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

export async function createPedidoCandidatos(data) {
  const { id, pedidoId, tecnicoId } = data;
  /** @type {[import("mysql2").ResultSetHeader, import("mysql2").FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO PedidoCandidatos (id, pedidoId, tecnicoId) VALUES (?, ?, ?)",
    [id, pedidoId, tecnicoId]
  );
  data.id = result.insertId;
  return data;
}

export async function updatePedidoCandidatos(id, data) {
  const { pedidoId, tecnicoId } = data;
  await pool.query(
    "UPDATE PedidoCandidatos SET pedidoId=?, tecnicoId=? WHERE id=?",
    [pedidoId, tecnicoId, id]
  );
}

export async function deletePedidoCandidatos(id) {
  await pool.query("DELETE FROM PedidoCandidatos WHERE id = ?", [id]);
}
