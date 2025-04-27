import pool from "../config/db.js";
import { FacturaSchema } from "../types/schemas.js";

/** @typedef {import("mysql2").QueryResult} QueryResult */
/** @typedef {import("mysql2").FieldPacket} FieldPacket */
/** @typedef {import("mysql2").ResultSetHeader} ResultSetHeader */

/** @typedef {import('../types/index.ts').Factura} Factura */

/**
 *
 * @returns {Promise<Factura[]>}
 */
export async function getAllFacturas() {
  const rows = await pool.query("SELECT * FROM Factura");
  const facturas = rows.map((row) => {
    const parsed = FacturaSchema.safeParse(row);
    if (!parsed.success) {
      throw new Error("El resultado no es una Factura válida", {
        cause: parsed.error,
      });
    }
    return parsed.data;
  });
  return facturas;
}

/**
 *
 * @param {number} id
 * @returns {Promise<Factura|null>}
 */
export async function getFacturaById(id) {
  const [rows] = await pool.query("SELECT * FROM Factura WHERE id = ?", [id]);
  const factura = { ...(rows[0] || null) };
  if (!factura) return null;
  const parsed = FacturaSchema.safeParse(factura);
  if (!parsed.success) {
    throw new Error("El resultado no es una Factura válida", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/**
 * @param {Factura} factura
 * @returns {Promise<Factura>}
 */
export async function createFactura(factura) {
  const { id, usuarioId, fecha, descripcion, total, metodoPago } = factura;
  /** @type {[import("mysql2").ResultSetHeader, import("mysql2").FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO Factura (id, usuarioId, fecha, descripcion, total, metodoPago) VALUES (?, ?, ?, ?, ?, ?)",
    [id, usuarioId, fecha, descripcion, total, metodoPago]
  );
  // Validar la factura creada
  const parsed = FacturaSchema.safeParse({
    id: result.insertId,
    usuarioId,
    fecha,
    descripcion,
    total,
    metodoPago,
  });
  if (!parsed.success) {
    throw new Error("El resultado no es una Factura válida", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/**
 * @param {number} id
 * @param {Partial<Factura>} factura
 * @returns {Promise<[QueryResult, FieldPacket[]]>}
 */
export async function updateFactura(id, factura) {
  const { usuarioId, fecha, descripcion, total, metodoPago } = factura;
  const result = await pool.query(
    "UPDATE Factura SET usuarioId = ?, fecha = ?, descripcion = ?, total = ?, metodoPago = ? WHERE id = ?",
    [usuarioId, fecha, descripcion, total, metodoPago, id]
  );
  return result;
}

export async function deleteFactura(id) {
  await pool.query("DELETE FROM Factura WHERE id = ?", [id]);
}
