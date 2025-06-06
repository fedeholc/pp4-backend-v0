import pool from "../config/db.js";
import { TecnicoSchema } from "../types/schemas.js";

/** @typedef {import('../types').Tecnico} Tecnico */
/** @typedef {import("mysql2").QueryResult} QueryResult */
/** @typedef {import("mysql2").FieldPacket} FieldPacket */
/** @typedef {import("mysql2").ResultSetHeader} ResultSetHeader */

/** @typedef {import('../types').UpdateResult} UpdateResult */
/** @typedef {import('../types').DeleteResult} DeleteResult */

/**
 *
 * @returns {Promise<Tecnico[]>}
 */
export async function getAllTecnicos() {
  const [rows] = await pool.query("SELECT * FROM Tecnico");
  const tecnicos =
    Array.isArray(rows) &&
    rows.map((row) => {
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
  // Obtener datos del técnico
  const [tecnicoRows] = await pool.query("SELECT * FROM Tecnico WHERE id = ?", [
    id,
  ]);
  const tecnico = tecnicoRows[0];
  if (!tecnico) return null;

  // Obtener pedidos asociados al técnico
  const [pedidosRows] = await pool.query(
    `SELECT p.*, c.nombre as clienteNombre, c.apellido as clienteApellido, 
     a.nombre as areaNombre 
     FROM Pedido p 
     LEFT JOIN Cliente c ON p.clienteId = c.id 
     LEFT JOIN Areas a ON p.areaId = a.id 
     WHERE p.tecnicoId = ?`,
    [id]
  );

  // Obtener áreas del técnico
  const [areasRows] = await pool.query(
    `SELECT ta.id as tecnicoAreaId, ta.areaId, a.nombre, a.descripcion
     FROM TecnicoAreas ta
     LEFT JOIN Areas a ON ta.areaId = a.id
     WHERE ta.tecnicoId = ?`,
    [id]
  );

  // Validar el técnico
  const parsed = TecnicoSchema.safeParse(tecnico);
  if (!parsed.success) {
    throw new Error("El resultado no es un Tecnico válido", {
      cause: parsed.error,
    });
  }

  // Agregar los pedidos y áreas al objeto técnico
  const tecnicoCompleto = {
    ...parsed.data,
    pedidos: pedidosRows || [],
    areas: areasRows || [],
  };

  return tecnicoCompleto;
}

/**
 *
 * @param {number} id
 * @returns {Promise<Tecnico|null>}
 */
export async function getTecnicoByUserId(id) {
  const [rows] = await pool.query("SELECT * FROM Tecnico WHERE usuarioId = ?", [
    id,
  ]);
  const tecnico = rows[0];
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
    fechaRegistro,
  } = tecnico;

  // Formatear fechaRegistro a 'YYYY-MM-DD HH:mm:ss'
  const formattedFechaRegistro = formatFechaRegistro(fechaRegistro);

  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO Tecnico (id, usuarioId, nombre, apellido, telefono, direccion, caracteristicas, fechaRegistro) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      usuarioId,
      nombre,
      apellido,
      telefono,
      direccion,
      caracteristicas,
      formattedFechaRegistro,
    ]
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
    fechaRegistro,
  });
  if (!parsed.success) {
    throw new Error("El resultado no es un Tecnico válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/**
 * Formats a date string or Date object to 'YYYY-MM-DD HH:mm:ss'
 * @param {string | number | Date} fechaRegistro
 * @returns {string}
 */
export function formatFechaRegistro(fechaRegistro) {
  const date = new Date(fechaRegistro);
  const formattedFechaRegistro = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}`;
  return formattedFechaRegistro;
}

/**
 *
 * @param {number} id
 * @param {Tecnico} tecnico
 * @returns {Promise<UpdateResult>}
 */
export async function updateTecnico(id, tecnico) {
  const { nombre, apellido, telefono, direccion, caracteristicas } = tecnico;
  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query(
    "UPDATE Tecnico SET nombre = ?, apellido = ?, telefono = ?, direccion = ?, caracteristicas = ? WHERE id = ?",
    [nombre, apellido, telefono, direccion, caracteristicas, id]
  );
  const affectedRows = result.affectedRows;
  return { affectedRows };
}

/**
 * @param {number} id
 * @returns {Promise<DeleteResult>}
 */
export async function deleteTecnico(id) {
  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query("DELETE FROM Tecnico WHERE id = ?", [id]);
  return result;
}
