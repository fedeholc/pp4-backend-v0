import { describe, expect, it } from "vitest";
import {
  getAllAreas,
  getAreaById,
  createArea,
  updateArea,
  deleteArea,
} from "../services/areasService.js";
import { AreaSchema } from "../types/schemas.js";

describe("getAllAreas", () => {
  it("debe retornar un array de áreas válidas", async () => {
    const areas = await getAllAreas();
    expect(Array.isArray(areas)).toBe(true);
    for (const area of areas) {
      const parsed = AreaSchema.safeParse(area);
      expect(parsed.success).toBe(true);
    }
  });
});

describe("createArea y deleteArea", () => {
  it("debe crear y luego eliminar un área", async () => {
    const areaPrueba = {
      id: undefined,
      nombre: `TestArea${Date.now()}`,
      descripcion: "Descripción de prueba",
    };
    const creada = await createArea(areaPrueba);
    expect(creada.id).toBeTruthy();
    expect(creada.nombre).toBe(areaPrueba.nombre);
    // Eliminar
    const borrado = await deleteArea(creada.id);
    expect(borrado.affectedRows).toBe(1);
  });
});

describe("getAreaById", () => {
  it("debe retornar un área válida si existe", async () => {
    // Crea un área para probar
    const areaPrueba = {
      id: undefined,
      nombre: `TestArea${Date.now()}`,
      descripcion: "Descripción de prueba",
    };
    const creada = await createArea(areaPrueba);
    const area = await getAreaById(creada.id);
    expect(area).toBeTruthy();
    const parsed = AreaSchema.safeParse(area);
    expect(parsed.success).toBe(true);
    // Limpiar
    await deleteArea(creada.id);
  });

  it("debe retornar null si el área no existe", async () => {
    const area = await getAreaById(999999);
    expect(area).toBeNull();
  });
});

describe("updateArea", () => {
  it("debe actualizar un área existente", async () => {
    // Crear área de prueba
    const areaPrueba = {
      id: undefined,
      nombre: `TestArea${Date.now()}`,
      descripcion: "Descripción original",
    };
    const creada = await createArea(areaPrueba);
    // Actualizar
    const nuevosDatos = {
      nombre: "NombreActualizado",
      descripcion: "Descripción actualizada",
    };
    await updateArea(creada.id, nuevosDatos);
    // Verificar actualización
    const areaActualizada = await getAreaById(creada.id);
    expect(areaActualizada.nombre).toBe(nuevosDatos.nombre);
    expect(areaActualizada.descripcion).toBe(nuevosDatos.descripcion);
    // Limpiar
    await deleteArea(creada.id);
  });
});
