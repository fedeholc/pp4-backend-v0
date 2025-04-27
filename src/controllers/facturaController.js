import * as facturaService from "../services/facturaService.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function getAll(req, res, next) {
  try {
    const facturas = await facturaService.getAllFacturas();
    res.json(facturas);
  } catch (err) {
    next(err);
  }
}

/**
 * @param {import('express').Request & { params: { id: number }}} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function getById(req, res, next) {
  try {
    const factura = await facturaService.getFacturaById(req.params.id);
    if (!factura)
      return res.status(404).json({ message: "Factura no encontrada" });
    res.json(factura);
  } catch (err) {
    next(err);
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function create(req, res, next) {
  try {
    const { id, usuarioId, fecha, descripcion, total, metodoPago } = req.body;
    if (!usuarioId || !descripcion || !total || !metodoPago)
      return res.status(400).json({ message: "Faltan datos requeridos" });
    const factura = await facturaService.createFactura({
      id,
      usuarioId,
      fecha,
      descripcion,
      total,
      metodoPago,
    });
    res.status(201).json(factura);
  } catch (err) {
    next(err);
  }
}

/**
 * @param {import('express').Request & { params: { id: number }}} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function update(req, res, next) {
  try {
    await facturaService.updateFactura(req.params.id, req.body);
    res.json({ message: "Factura actualizada" });
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
    await facturaService.deleteFactura(req.params.id);
    res.json({ message: "Factura eliminada" });
  } catch (err) {
    next(err);
  }
}
