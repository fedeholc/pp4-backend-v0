import * as tecnicoService from "../services/tecnicoService.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function getAll(req, res, next) {
  try {
    const tecnicos = await tecnicoService.getAllTecnicos();
    res.json(tecnicos);
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
    const tecnico = await tecnicoService.getTecnicoById(req.params.id);
    if (!tecnico)
      return res.status(404).json({ message: "Técnico no encontrado" });
    res.json(tecnico);
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
    const {
      id,
      usuarioId,
      nombre,
      apellido,
      telefono,
      direccion,
      caracteristicas,
      fechaRegistro
    } = req.body;
    if (!usuarioId || !nombre || !apellido)
      return res.status(400).json({ message: "Faltan datos requeridos" });
    const tecnico = await tecnicoService.createTecnico({
      id,
      usuarioId,
      nombre,
      apellido,
      telefono,
      direccion,
      caracteristicas,
      fechaRegistro
    });
    res.status(201).json(tecnico);
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
    const { nombre, apellido, telefono, direccion, caracteristicas } = req.body;
    await tecnicoService.updateTecnico(req.params.id, {
      nombre,
      apellido,
      telefono,
      direccion,
      caracteristicas,
    });
    res.json({ message: "Técnico actualizado" });
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
    await tecnicoService.deleteTecnico(req.params.id);
    res.json({ message: "Técnico eliminado" });
  } catch (err) {
    next(err);
  }
}
