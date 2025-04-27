import pool from "../config/db.js";
import bcrypt from "bcrypt";

export async function getAllUsuarios() {
  const [rows] = await pool.query("SELECT id, email, rol FROM Usuario");
  return rows;
}

export async function getUsuarioById(id) {
  const [rows] = await pool.query(
    "SELECT id, email, rol FROM Usuario WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

export async function createUsuario({ email, password, rol }) {
  const hash = await bcrypt.hash(password, 10);
  /** @type {[import("mysql2").ResultSetHeader, import("mysql2").FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO Usuario (email, password, rol) VALUES (?, ?, ?)",
    [email, hash, rol]
  );
  return { id: result.insertId, email, rol };
}

export async function updateUsuario(id, { email, password, rol }) {
  let query = "UPDATE Usuario SET email = ?, rol = ?";
  const params = [email, rol];
  if (password) {
    query += ", password = ?";
    params.push(await bcrypt.hash(password, 10));
  }
  query += " WHERE id = ?";
  params.push(id);
  await pool.query(query, params);
}

export async function deleteUsuario(id) {
  await pool.query("DELETE FROM Usuario WHERE id = ?", [id]);
}
