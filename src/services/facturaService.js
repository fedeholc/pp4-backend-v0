import pool from "../config/db.js";

export async function getAllFacturas() {
  const [rows] = await pool.query("SELECT * FROM Factura");
  return rows;
}

export async function getFacturaById(id) {
  const [rows] = await pool.query("SELECT * FROM Factura WHERE id = ?", [id]);
  return rows[0] || null;
}

export async function createFactura(factura) {
  const { id, usuarioId, fecha, descripcion, total, metodoPago } = factura;
  /** @type {[import("mysql2").ResultSetHeader, import("mysql2").FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO Factura (id, usuarioId, fecha, descripcion, total, metodoPago) VALUES (?, ?, ?, ?, ?, ?)",
    [id, usuarioId, fecha, descripcion, total, metodoPago]
  );
  return {
    id: result.insertId,
    usuarioId,
    fecha,
    descripcion,
    total,
    metodoPago,
  };
}

export async function updateFactura(id, factura) {
  const { usuarioId, fecha, descripcion, total, metodoPago } = factura;
  await pool.query(
    "UPDATE Factura SET usuarioId = ?, fecha = ?, descripcion = ?, total = ?, metodoPago = ? WHERE id = ?",
    [usuarioId, fecha, descripcion, total, metodoPago, id]
  );
}

export async function deleteFactura(id) {
  await pool.query("DELETE FROM Factura WHERE id = ?", [id]);
}
