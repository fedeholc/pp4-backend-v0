import * as pedidoDisponibilidadService from "../services/pedidoDisponibilidadService.js";

export async function getAll(req, res, next) {
  try {
    const items =
      await pedidoDisponibilidadService.getAllPedidoDisponibilidad();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const item = await pedidoDisponibilidadService.getPedidoDisponibilidadById(
      req.params.id
    );
    if (!item)
      return res
        .status(404)
        .json({ message: "PedidoDisponibilidad no encontrado" });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const data = req.body;
    if (
      !data.pedidoId ||
      !data.clienteId ||
      !data.dia ||
      !data.horaInicio ||
      !data.horaFin
    )
      return res.status(400).json({ message: "Faltan datos requeridos" });
    const nuevo = await pedidoDisponibilidadService.createPedidoDisponibilidad(
      data
    );
    res.status(201).json(nuevo);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    await pedidoDisponibilidadService.updatePedidoDisponibilidad(
      req.params.id,
      req.body
    );
    res.json({ message: "PedidoDisponibilidad actualizado" });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await pedidoDisponibilidadService.deletePedidoDisponibilidad(req.params.id);
    res.json({ message: "PedidoDisponibilidad eliminado" });
  } catch (err) {
    next(err);
  }
}
