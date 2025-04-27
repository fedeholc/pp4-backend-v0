import pool from "../config/db.js";

export async function getAllTecnicos() {
  const [rows] = await pool.query("SELECT * FROM Tecnico");
  return rows;
}

export async function getTecnicoById(id) {
  const [rows] = await pool.query("SELECT * FROM Tecnico WHERE id = ?", [id]);
  return rows[0] || null;
}

export async function createTecnico(tecnico) {
  const {
    id,
    usuarioId,
    nombre,
    apellido,
    telefono,
    direccion,
    caracteristicas,
  } = tecnico;
  /** @type {[import("mysql2").ResultSetHeader, import("mysql2").FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO Tecnico (id, usuarioId, nombre, apellido, telefono, direccion, caracteristicas) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, usuarioId, nombre, apellido, telefono, direccion, caracteristicas]
  );
  return {
    id: result.insertId,
    usuarioId,
    nombre,
    apellido,
    telefono,
    direccion,
    caracteristicas,
  };
}

export async function updateTecnico(id, tecnico) {
  const { nombre, apellido, telefono, direccion, caracteristicas } = tecnico;
  await pool.query(
    "UPDATE Tecnico SET nombre = ?, apellido = ?, telefono = ?, direccion = ?, caracteristicas = ? WHERE id = ?",
    [nombre, apellido, telefono, direccion, caracteristicas, id]
  );
}

export async function deleteTecnico(id) {
  await pool.query("DELETE FROM Tecnico WHERE id = ?", [id]);
}
