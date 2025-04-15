import pool from "../config/db.js";

export async function getAllPedidos() {
  const [rows] = await pool.query("SELECT * FROM Pedido");
  return rows;
}

export async function getPedidoById(id) {
  const [rows] = await pool.query("SELECT * FROM Pedido WHERE id = ?", [id]);
  return rows[0] || null;
}

export async function createPedido(pedido) {
  const {
    id,
    clienteId,
    tecnicoId,
    estado,
    areaId,
    requerimiento,
    califiacion,
    comentario,
    respuesta,
    fechaCreacion,
    fechaCierre,
    fechaCancelado,
  } = pedido;
  await pool.query(
    "INSERT INTO Pedido (id, clienteId, tecnicoId, estado, areaId, requerimiento, califiacion, comentario, respuesta, fechaCreacion, fechaCierre, fechaCancelado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      clienteId,
      tecnicoId,
      estado,
      areaId,
      requerimiento,
      califiacion,
      comentario,
      respuesta,
      fechaCreacion,
      fechaCierre,
      fechaCancelado,
    ]
  );
  return pedido;
}

export async function updatePedido(id, pedido) {
  const {
    clienteId,
    tecnicoId,
    estado,
    areaId,
    requerimiento,
    califiacion,
    comentario,
    respuesta,
    fechaCreacion,
    fechaCierre,
    fechaCancelado,
  } = pedido;
  await pool.query(
    "UPDATE Pedido SET clienteId=?, tecnicoId=?, estado=?, areaId=?, requerimiento=?, califiacion=?, comentario=?, respuesta=?, fechaCreacion=?, fechaCierre=?, fechaCancelado=? WHERE id=?",
    [
      clienteId,
      tecnicoId,
      estado,
      areaId,
      requerimiento,
      califiacion,
      comentario,
      respuesta,
      fechaCreacion,
      fechaCierre,
      fechaCancelado,
      id,
    ]
  );
}

export async function deletePedido(id) {
  await pool.query("DELETE FROM Pedido WHERE id = ?", [id]);
}
