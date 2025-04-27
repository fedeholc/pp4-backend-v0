import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import process from "node:process";
import { config } from "dotenv";
import { UsuarioSchema } from "../types/schemas.js";

/** @typedef {import("mysql2").QueryResult} QueryResult */
/** @typedef {import("mysql2").FieldPacket} FieldPacket */
/** @typedef {import("mysql2").ResultSetHeader} ResultSetHeader */

 
/** @typedef {import('../types/index.ts').UpdateResult} UpdateResult */
/** @typedef {import('../types/index.ts').DeleteResult} DeleteResult */
/** @typedef {import('../types/index.ts').Usuario} Usuario */

config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

/**
 * Registra un nuevo usuario.
 */
export async function register({ email, password, rol }) {
  const exists = /** @type {number[]} */ await pool.query(
    "SELECT id FROM Usuario WHERE email = ?",
    [email]
  );

  if (exists?.length > 0) throw new Error("El email ya está registrado");

  const hash = await bcrypt.hash(password, 10);

  /** @type {[ResultSetHeader,FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO Usuario (email, password, rol) VALUES (?, ?, ?)",
    [email, hash, rol]
  );
  // Validar el usuario creado
  const parsed = UsuarioSchema.safeParse({ id: result.insertId, email, rol });
  if (!parsed.success) {
    throw new Error("El resultado no es un Usuario válido", {
      cause: parsed.error,
    });
  }
  return parsed.data;
}

/**
 * Autentica un usuario y retorna un JWT.
 */
export async function login({ email, password }) {
  const users = /** @type {Usuario[]} */ (
    await pool.query("SELECT * FROM Usuario WHERE email = ?", [email])
  );
  if (users.length === 0) throw new Error("Credenciales inválidas");

  const user = /** @type {Usuario} */ (users[0]);
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Credenciales inválidas");
  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
  return { token, user: { id: user.id, email: user.email, rol: user.rol } };
}
