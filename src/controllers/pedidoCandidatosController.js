import * as pedidoCandidatosService from "../services/pedidoCandidatosService.js";

export async function getAll(req, res, next) {
  try {
    const items = await pedidoCandidatosService.getAllPedidoCandidatos();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const item = await pedidoCandidatosService.getPedidoCandidatosById(
      req.params.id
    );
    if (!item)
      return res
        .status(404)
        .json({ message: "PedidoCandidatos no encontrado" });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const data = req.body;
    if (!data.pedidoId || !data.tecnicoId)
      return res.status(400).json({ message: "Faltan datos requeridos" });
    const nuevo = await pedidoCandidatosService.createPedidoCandidatos(data);
    res.status(201).json(nuevo);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    await pedidoCandidatosService.updatePedidoCandidatos(
      req.params.id,
      req.body
    );
    res.json({ message: "PedidoCandidatos actualizado" });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await pedidoCandidatosService.deletePedidoCandidatos(req.params.id);
    res.json({ message: "PedidoCandidatos eliminado" });
  } catch (err) {
    next(err);
  }
}
