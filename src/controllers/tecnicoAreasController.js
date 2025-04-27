import * as tecnicoAreasService from "../services/tecnicoAreasService.js";

export async function getAll(req, res, next) {
  try {
    const tecnicoAreas = await tecnicoAreasService.getAllTecnicoAreas();
    res.json(tecnicoAreas);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const tecnicoArea = await tecnicoAreasService.getTecnicoAreaById(
      req.params.id
    );
    if (!tecnicoArea)
      return res.status(404).json({ message: "Técnico-Area no encontrado" });
    res.json(tecnicoArea);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const { id, tecnicoId, areaId } = req.body;
    if (!tecnicoId || !areaId)
      return res.status(400).json({ message: "Faltan datos requeridos" });
    const tecnicoArea = await tecnicoAreasService.createTecnicoArea({
      id,
      tecnicoId,
      areaId,
    });
    res.status(201).json(tecnicoArea);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const { tecnicoId, areaId } = req.body;
    await tecnicoAreasService.updateTecnicoArea(req.params.id, {
      tecnicoId,
      areaId,
    });
    res.json({ message: "Técnico-Area actualizado" });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await tecnicoAreasService.deleteTecnicoArea(req.params.id);
    res.json({ message: "Técnico-Area eliminado" });
  } catch (err) {
    next(err);
  }
}
