import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import process from "node:process";
import { config } from "dotenv";
import { UsuarioSchema } from "../types/schemas.js";

/** @typedef {import("mysql2").QueryResult} QueryResult */
/** @typedef {import("mysql2").FieldPacket} FieldPacket */
/** @typedef {import("mysql2").ResultSetHeader} ResultSetHeader */

/** @typedef {import('../types').UpdateResult} UpdateResult */
/** @typedef {import('../types').DeleteResult} DeleteResult */
/** @typedef {import('../types').Usuario} Usuario */

config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

/**
 * Registra un nuevo usuario.
 */
export async function register({ email, password, rol }) {
  const [exists] = /** @type {number[]} */ await pool.query(
    "SELECT id FROM Usuario WHERE email = ?",
    [email]
  );
  console.log("exists:", exists, exists[0]);

  if (exists[0]) {
    const error = new Error("El email ya está registrado");
    // Add custom property
   /*  error.message = "ER_DUP_ENTRY"; */
    throw error;
  }

  const hash = await bcrypt.hash(password, 10);

  /** @type {[ResultSetHeader,FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO Usuario (email, password, rol) VALUES (?, ?, ?)",
    [email, hash, rol]
  );
  console.log(result);
  if (result.affectedRows === 0) throw new Error("Error al crear el usuario");
  if (result.insertId === 0) throw new Error("Error al crear el usuario");
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
  const [result] = await pool.query("SELECT * FROM Usuario WHERE email = ?", [
    email,
  ]);
  if (Array.isArray(result) && result.length === 0) return null; // Usuario no encontrado

  const user = /** @type {Usuario} */ (result[0]);
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Credenciales inválidas");
  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
  return { token, user: { id: user.id, email: user.email, rol: user.rol } };
}
