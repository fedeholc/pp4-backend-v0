import * as pedidoService from "../services/pedidoService.js";

export async function getAll(req, res, next) {
  try {
    const pedidos = await pedidoService.getAllPedidos();
    res.json(pedidos);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const pedido = await pedidoService.getPedidoById(req.params.id);
    if (!pedido)
      return res.status(404).json({ message: "Pedido no encontrado" });
    res.json(pedido);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const pedido = req.body;
    if (
      !pedido.clienteId ||
      !pedido.areaId ||
      !pedido.requerimiento
    )
      return res.status(400).json({ message: "Faltan datos requeridos" });
    const nuevoPedido = await pedidoService.createPedido(pedido);
    res.status(201).json(nuevoPedido);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    await pedidoService.updatePedido(req.params.id, req.body);
    res.json({ message: "Pedido actualizado" });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await pedidoService.deletePedido(req.params.id);
    res.json({ message: "Pedido eliminado" });
  } catch (err) {
    next(err);
  }
}
