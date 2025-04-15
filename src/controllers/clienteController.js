import * as clienteService from "../services/clienteService.js";

export async function getAll(req, res, next) {
  try {
    const clientes = await clienteService.getAllClientes();
    res.json(clientes);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const cliente = await clienteService.getClienteById(req.params.id);
    if (!cliente)
      return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(cliente);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const { id, usuarioId, nombre, apellido, telefono, direccion } = req.body;
    if (!id || !usuarioId || !nombre || !apellido)
      return res.status(400).json({ message: "Faltan datos requeridos" });
    const cliente = await clienteService.createCliente({
      id,
      usuarioId,
      nombre,
      apellido,
      telefono,
      direccion,
    });
    res.status(201).json(cliente);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const { nombre, apellido, telefono, direccion } = req.body;
    await clienteService.updateCliente(req.params.id, {
      nombre,
      apellido,
      telefono,
      direccion,
    });
    res.json({ message: "Cliente actualizado" });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await clienteService.deleteCliente(req.params.id);
    res.json({ message: "Cliente eliminado" });
  } catch (err) {
    next(err);
  }
}
