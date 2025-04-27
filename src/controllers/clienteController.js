import * as clienteService from "../services/clienteService.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function getAll(req, res, next) {
  try {
    const clientes = await clienteService.getAllClientes();
    res.json(clientes);
  } catch (err) {
    next(err);
  }
}

/**
 * @param {import('express').Request & { params: { id: string }}} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function getById(req, res, next) {
  try {
    const cliente = await clienteService.getClienteById(
      parseInt(req.params.id)
    );
    if (!cliente)
      return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(cliente);
  } catch (err) {
    next(err);
  }
}

/**
 * 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function create(req, res, next) {
  try {
    const { id, usuarioId, nombre, apellido, telefono, direccion } = req.body;
    if (!usuarioId || !nombre || !apellido)
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

/**
 * @param {import('express').Request & { params: { id: string }}} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function update(req, res, next) {
  try {
    const { nombre, apellido, telefono, direccion } = req.body;
    await clienteService.updateCliente(parseInt(req.params.id), {
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

/**
 * @param {import('express').Request & { params: { id: number }}} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function remove(req, res, next) {
  try {
    await clienteService.deleteCliente(req.params.id);
    res.json({ message: "Cliente eliminado" });
  } catch (err) {
    next(err);
  }
}
