import pool from "../config/db.js";
import { formatDateForMySQL } from "../helpers/formatDate.js";
import { FacturaSchema } from "../types/schemas.js";

/** @typedef {import("mysql2").QueryResult} QueryResult */
/** @typedef {import("mysql2").FieldPacket} FieldPacket */
/** @typedef {import("mysql2").ResultSetHeader} ResultSetHeader */

/** @typedef {import('../types').UpdateResult} UpdateResult */
/** @typedef {import('../types').DeleteResult} DeleteResult */

/** @typedef {import('../types').Factura} Factura */

/**
 *
 * @returns {Promise<Factura[]>}
 */
export async function getAllFacturas() {
  const [rows] = await pool.query("SELECT * FROM Factura");
  const facturas =
    Array.isArray(rows) &&
    rows.map((row) => {
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
  const factura = rows[0];
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
    [id, usuarioId, formatDateForMySQL(fecha), descripcion, total, metodoPago]
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
 * @returns {Promise<UpdateResult>}
 */
export async function updateFactura(id, factura) {
  const { usuarioId, fecha, descripcion, total, metodoPago } = factura;
  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query(
    "UPDATE Factura SET usuarioId = ?, fecha = ?, descripcion = ?, total = ?, metodoPago = ? WHERE id = ?",
    [usuarioId, formatDateForMySQL(fecha), descripcion, total, metodoPago, id]
  );
  const affectedRows = result.affectedRows;
  return { affectedRows };
}

/**
 * @param {number} id
 * @returns {Promise<DeleteResult>}
 */
export async function deleteFactura(id) {
  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query("DELETE FROM Factura WHERE id = ?", [id]);
  return result;
}
