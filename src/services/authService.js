import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

/**
 * Registra un nuevo usuario.
 */
export async function register({ email, password, rol }) {
  const [exists] = await pool.query("SELECT id FROM Usuario WHERE email = ?", [
    email,
  ]);
  if (exists.length > 0) throw new Error("El email ya está registrado");
  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO Usuario (email, password, rol) VALUES (?, ?, ?)",
    [email, hash, rol]
  );
  return { id: result.insertId, email, rol };
}

/**
 * @typedef {import("mysql2").RowDataPacket} RowDataPacket
 */

/**
 * @typedef {Object} UsuarioBase
 * @property {number} id - Identificador único del usuario.
 * @property {string} email - Correo electrónico del usuario.
 * @property {string} password - Hash de la contraseña del usuario.
 * @property {'cliente'|'tecnico'|'admin'} rol - Rol del usuario.
 */

/**
 * @typedef {UsuarioBase & RowDataPacket} Usuario
 */

/**
 * Autentica un usuario y retorna un JWT.
 */
export async function login({ email, password }) {
  /** @type {[Usuario[], import("mysql2").FieldPacket[]]} */
  const [users] = await pool.query("SELECT * FROM Usuario WHERE email = ?", [
    email,
  ]);
  if (users.length === 0) throw new Error("Credenciales inválidas");
  const user = users[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Credenciales inválidas");
  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
  return { token, user: { id: user.id, email: user.email, rol: user.rol } };
}
