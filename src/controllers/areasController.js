import * as areasService from "../services/areasService.js";

/**
 * Obtiene todas las áreas.
 */
export async function getAll(req, res, next) {
  try {
    const areas = await areasService.getAllAreas();
    res.json(areas);
  } catch (err) {
    next(err);
  }
}

/**
 * Crea un área nueva.
 */
export async function create(req, res, next) {
  try {
    const area = await areasService.createArea(req.body);
    res.status(201).json(area);
  } catch (err) {
    next(err);
  }
}

/**
 * Obtiene un área por ID.
 */
export async function getById(req, res, next) {
  try {
    const area = await areasService.getAreaById(req.params.id);
    if (!area) return res.status(404).json({ message: "Área no encontrada" });
    res.json(area);
  } catch (err) {
    next(err);
  }
}

/**
 * Actualiza un área.
 */
export async function update(req, res, next) {
  try {
    await areasService.updateArea(req.params.id, req.body);
    res.json({ message: "Área actualizada" });
  } catch (err) {
    next(err);
  }
}

/**
 * Elimina un área.
 */
export async function remove(req, res, next) {
  try {
    await areasService.deleteArea(req.params.id);
    res.json({ message: "Área eliminada" });
  } catch (err) {
    next(err);
  }
}
