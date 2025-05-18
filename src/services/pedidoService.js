import pool from "../config/db.js";
import { formatDateForMySQL } from "../helpers/formatDate.js";
import {
  PedidoSchema,
  PedidoCompletoSchema,
  PedidoDisponibilidadSchema,
  CandidatoVistaSchema,
} from "../types/schemas.js";

/** @typedef {import("mysql2").QueryResult} QueryResult */
/** @typedef {import("mysql2").FieldPacket} FieldPacket */
/** @typedef {import("mysql2").ResultSetHeader} ResultSetHeader */

/** @typedef {import('../types').UpdateResult} UpdateResult */
/** @typedef {import('../types').DeleteResult} DeleteResult */

/** @typedef {import('../types').Pedido} Pedido */

/**
 * Construye un WHERE dinámico y los parámetros para una consulta SQL a partir de un objeto de filtros.
 * @param {Object} filtros - Objeto con pares campo:valor
 * @returns {{ where: string, params: any[] }}
 */
export function buildWhereAndParams(filtros = {}) {
  const keys = Object.keys(filtros);
  if (keys.length === 0) return { where: "", params: [] };
  const where = keys.map((campo) => `${campo} = ?`).join(" AND ");
  const params = keys.map((campo) => filtros[campo]);
  return { where, params };
}

/**
 * Obtiene todos los pedidos, opcionalmente filtrando por los campos indicados en el objeto filtros.
 * @param {Object} [filtros] - Objeto con pares campo:valor para filtrar
 * @returns {Promise<import("../types").PedidoCompleto[]>} - Lista de pedidos
 */
export async function getAllPedidos(filtros = {}) {
  let query = "SELECT * FROM Pedido";
  const { where, params } = buildWhereAndParams(filtros);
  if (where) {
    query += ` WHERE ${where}`;
  }
  const [rows] = await pool.query(query, params);
  const pedidos =
    Array.isArray(rows) &&
    (await Promise.all(
      rows.map(async (row) => {
        const parsed = PedidoSchema.safeParse(row);
        if (!parsed.success) {
          throw new Error("El resultado no es un Pedido válido", {
            cause: parsed.error,
          });
        }
        // Obtener info relacionada
        const [disponibilidad] = await pool.query(
          "SELECT * FROM PedidoDisponibilidad WHERE pedidoId = ?",
          [row.id]
        );
        const [candidatos] = await pool.query(
          `SELECT pc.*, t.* FROM PedidoCandidatos pc
           INNER JOIN Tecnico t ON pc.tecnicoId = t.id
           WHERE pc.pedidoId = ?`,
          [row.id]
        );
        const [clienteRows] = await pool.query(
          "SELECT * FROM Cliente WHERE id = ?",
          [row.clienteId]
        );
        const [tecnicoRows] = row.tecnicoId
          ? await pool.query("SELECT * FROM Tecnico WHERE id = ?", [
              row.tecnicoId,
            ])
          : [[]];
        const [areaRows] = row.areaId
          ? await pool.query("SELECT * FROM Areas WHERE id = ?", [row.areaId])
          : [[]];
        // Validar arrays relacionados
        const disponibilidadVal = Array.isArray(disponibilidad)
          ? disponibilidad.filter(
              (d) => PedidoDisponibilidadSchema.safeParse(d).success
            )
          : [];

        let candidatosVista = [];
        if (Array.isArray(candidatos) && candidatos.length > 0) {
          for (const candidato of candidatos) {
            /**@type {import("../types").CandidatoVista} */
            let candidatoVista = {
              id: /** @type {any} */ (candidato).id,
              pedidoId: /** @type {any} */ (candidato).pedidoId,
              tecnicoId: /** @type {any} */ (candidato).tecnicoId,
              nombre: /** @type {any} */ (candidato).nombre,
              apellido: /** @type {any} */ (candidato).apellido,
              telefono: /** @type {any} */ (candidato).telefono,
              caracteristicas: /** @type {any} */ (candidato).caracteristicas,
              fechaRegistro: /** @type {any} */ (candidato).fechaRegistro,
              calificaciones: [],
            };
            let [result] = await pool.query(
              "SELECT calificacion FROM Pedido WHERE tecnicoId = ?",
              [candidatoVista.tecnicoId]
            );
            if (Array.isArray(result) && result.length > 0) {
              candidatoVista.calificaciones = result.map((r) =>
                r.calificacion ? r.calificacion : undefined
              );
            }
            candidatosVista.push(candidatoVista);
          }
          console.log("Candidatos:", candidatosVista);
        }
        const candidatosVal = Array.isArray(candidatosVista)
          ? candidatosVista.filter(
              (c) => CandidatoVistaSchema.safeParse(c).success
            )
          : [];

        console.log("cv:", candidatosVal);
        // Validar objeto completo
        const pedidoCompleto = {
          ...parsed.data,
          cliente: clienteRows[0] || null,
          tecnico: tecnicoRows[0] || null,
          area: areaRows[0] || null,
          disponibilidad: disponibilidadVal,
          candidatos: candidatosVal,
        };
        const valid = PedidoCompletoSchema.safeParse(pedidoCompleto);
        if (!valid.success) {
          throw new Error("El resultado no es un PedidoCompleto válido", {
            cause: valid.error,
          });
        }
        return valid.data;
      })
    ));
  return pedidos;
}

/**
 * @param {number} id
 * @returns {Promise<Pedido|null>}
 */
export async function getPedidoById(id) {
  const [rows] = await pool.query("SELECT * FROM Pedido WHERE id = ?", [id]);
  const pedido = rows[0];
  if (!pedido) return null;
  const parsed = PedidoSchema.safeParse(pedido);
  if (!parsed.success) {
    throw new Error("El resultado no es un Pedido válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/**
 * @param {Pedido} pedido
 * @returns {Promise<Pedido>}
 */
export async function createPedido(pedido) {
  const {
    id,
    clienteId,
    tecnicoId,
    estado,
    areaId,
    requerimiento,
    calificacion,
    comentario,
    respuesta,
    fechaCreacion,
    fechaCierre,
    fechaCancelado,
  } = pedido;

  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO Pedido (id, clienteId, tecnicoId, estado, areaId, requerimiento, calificacion, comentario, respuesta, fechaCreacion, fechaCierre, fechaCancelado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      clienteId,
      tecnicoId,
      estado,
      areaId,
      requerimiento,
      calificacion,
      comentario,
      respuesta,
      formatDateForMySQL(fechaCreacion),
      formatDateForMySQL(fechaCierre),
      formatDateForMySQL(fechaCancelado),
    ]
  );
  // Validar el pedido creado
  const parsed = PedidoSchema.safeParse({
    id: result.insertId,
    clienteId,
    tecnicoId,
    estado,
    areaId,
    requerimiento,
    calificacion,
    comentario,
    respuesta,
    fechaCreacion,
    fechaCierre,
    fechaCancelado,
  });
  if (!parsed.success) {
    console.log("Error al crear el pedido:", parsed.error);
    throw new Error("El resultado no es un Pedido válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/** 
 * @param {number} id
 * @param {Pedido} pedido
 * @returns {Promise<UpdateResult>}

*/
export async function updatePedido(id, pedido) {
  const {
    clienteId,
    tecnicoId,
    estado,
    areaId,
    requerimiento,
    calificacion,
    comentario,
    respuesta,
    fechaCreacion,
    fechaCierre,
    fechaCancelado,
  } = pedido;
  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query(
    "UPDATE Pedido SET id=? clienteId=?, tecnicoId=?, estado=?, areaId=?, requerimiento=?, calificacion=?, comentario=?, respuesta=?, fechaCreacion=?, fechaCierre=?, fechaCancelado=? WHERE id=?",
    [
      clienteId,
      tecnicoId,
      estado,
      areaId,
      requerimiento,
      calificacion,
      comentario,
      respuesta,
      fechaCreacion,
      fechaCierre,
      fechaCancelado,
      id,
    ]
  );
  const affectedRows = result.affectedRows;
  return { affectedRows };
}

/**
 * @param {number} id
 * @returns {Promise<DeleteResult>}
 */
export async function deletePedido(id) {
  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query("DELETE FROM Pedido WHERE id = ?", [id]);
  const affectedRows = result.affectedRows;
  return { affectedRows };
}
