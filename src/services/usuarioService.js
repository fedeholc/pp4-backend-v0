import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { UsuarioSchema } from "../types/schemas.js";

/** @typedef {import('../types/index.js').Usuario} Usuario */

/** @typedef {import("mysql2").QueryResult} QueryResult */
/** @typedef {import("mysql2").FieldPacket} FieldPacket */
/** @typedef {import("mysql2").ResultSetHeader} ResultSetHeader */

/** @typedef {import('../types/index.ts').UpdateResult} UpdateResult */
/** @typedef {import('../types/index.ts').DeleteResult} DeleteResult */

/**
 *
 * @returns {Promise<Usuario[]>}
 */
export async function getAllUsuarios() {
  const [rows] = await pool.query("SELECT id, email, rol FROM Usuario");
  const usuarios =
    Array.isArray(rows) &&
    rows.map((row) => {
      const parsed = UsuarioSchema.safeParse(row);
      if (!parsed.success) {
        throw new Error("El resultado no es un Usuario válido", {
          cause: parsed.error,
        });
      }
      return parsed.data;
    });
  return usuarios;
}

/**
 *
 * @param {number} id
 * @returns  {Promise<Usuario|null>}
 */
export async function getUsuarioById(id) {
  const [rows] = await pool.query(
    "SELECT id, email, rol FROM Usuario WHERE id = ?",
    [id]
  );
  const usuario = rows[0];
  if (!usuario) return null;
  const parsed = UsuarioSchema.safeParse(usuario);
  if (!parsed.success) {
    throw new Error("El resultado no es un Usuario válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/**
 *
 * @param {Usuario} usuario
 * @returns {Promise<Usuario>}
 */
export async function createUsuario(usuario) {
  const hash = await bcrypt.hash(usuario.password, 10);

  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO Usuario (email, password, rol) VALUES (?, ?, ?)",
    [usuario.email, hash, usuario.rol]
  );
  // Validar el usuario creado
  const parsed = UsuarioSchema.safeParse({
    id: result.insertId,
    email: usuario.email,
    rol: usuario.rol,
  });
  if (!parsed.success) {
    throw new Error("El resultado no es un Usuario válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/**
 *
 * @param {number} id
 * @param {Usuario} usuario
 * @returns {Promise<UpdateResult>}
 *
 */
export async function updateUsuario(id, usuario) {
  let query = "UPDATE Usuario SET email = ?, rol = ?";
  const params = [usuario.email, usuario.rol];
  if (usuario.password) {
    query += ", password = ?";
    params.push(await bcrypt.hash(usuario.password, 10));
  }
  query += " WHERE id = ?";
  params.push(id.toString());
  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query(query, params);
  const affectedRows = result.affectedRows;
  return { affectedRows };
}

/**
 * @param {number} id
 * @returns {Promise<DeleteResult>}
 */
export async function deleteUsuario(id) {
  /** @type {[ ResultSetHeader,  FieldPacket[]]} */
  const [result] = await pool.query("DELETE FROM Usuario WHERE id = ?", [id]);
  const affectedRows = result.affectedRows;
  return { affectedRows };
}
