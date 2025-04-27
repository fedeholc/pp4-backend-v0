import pool from "../config/db.js";

export async function getAllTecnicoAreas() {
  const [rows] = await pool.query("SELECT * FROM TecnicoAreas");
  return rows;
}

export async function getTecnicoAreaById(id) {
  const [rows] = await pool.query("SELECT * FROM TecnicoAreas WHERE id = ?", [
    id,
  ]);
  return rows[0] || null;
}

export async function createTecnicoArea(tecnicoArea) {
  const { id, tecnicoId, areaId } = tecnicoArea;
  /** @type {[import("mysql2").ResultSetHeader, import("mysql2").FieldPacket[]]} */
  const [result] = await pool.query(
    "INSERT INTO TecnicoAreas (id, tecnicoId, areaId) VALUES (?, ?, ?)",
    [id, tecnicoId, areaId]
  );
  return { id: result.insertId, tecnicoId, areaId };
}

export async function updateTecnicoArea(id, tecnicoArea) {
  const { tecnicoId, areaId } = tecnicoArea;
  await pool.query(
    "UPDATE TecnicoAreas SET tecnicoId = ?, areaId = ? WHERE id = ?",
    [tecnicoId, areaId, id]
  );
}

export async function deleteTecnicoArea(id) {
  await pool.query("DELETE FROM TecnicoAreas WHERE id = ?", [id]);
}
