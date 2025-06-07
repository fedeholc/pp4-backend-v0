import { describe, expect, it, vi, beforeEach } from "vitest";
import { AreaSchema } from "../types/schemas.js";

const mockAreas = [
  { id: 1, nombre: "Area 1", descripcion: "Desc 1" },
  { id: 2, nombre: "Area 2", descripcion: "Desc 2" },
];

vi.mock("../config/db.js", () => ({
  default: { query: vi.fn() },
}));

let pool;
beforeEach(async () => {
  pool = (await import("../config/db.js")).default;
  pool.query["mockReset"]();
});

describe("getAllAreas (mock)", () => {
  it("debe retornar un array de áreas válidas", async () => {
    pool.query["mockResolvedValueOnce"]([mockAreas]);
    const { getAllAreas } = await import("../services/areasService.js");
    const areas = await getAllAreas();
    expect(Array.isArray(areas)).toBe(true);
    for (const area of areas) {
      const parsed = AreaSchema.safeParse(area);
      expect(parsed.success).toBe(true);
    }
  });
});

describe("createArea y deleteArea (mock)", () => {
  it("debe crear y luego eliminar un área", async () => {
    const areaPrueba = {
      id: undefined,
      nombre: `TestArea${Date.now()}`,
      descripcion: "Descripción de prueba",
    };
    pool.query["mockResolvedValueOnce"]([{ insertId: 123 }]); // createArea
    pool.query["mockResolvedValueOnce"]([{ affectedRows: 1 }]); // deleteArea
    const { createArea, deleteArea } = await import(
      "../services/areasService.js"
    );
    const creada = await createArea(areaPrueba);
    expect(creada.id).toBeTruthy();
    expect(creada.nombre).toBe(areaPrueba.nombre);
    const borrado = await deleteArea(creada.id);
    expect(borrado.affectedRows).toBe(1);
  });
});

describe("getAreaById (mock)", () => {
  it("debe retornar un área válida si existe", async () => {
    pool.query["mockResolvedValueOnce"]([[mockAreas[0]]]);
    const { getAreaById } = await import("../services/areasService.js");
    const area = await getAreaById(1);
    expect(area).toBeTruthy();
    const parsed = AreaSchema.safeParse(area);
    expect(parsed.success).toBe(true);
  });

  it("debe retornar null si el área no existe", async () => {
    pool.query["mockResolvedValueOnce"]([[]]);
    const { getAreaById } = await import("../services/areasService.js");
    const area = await getAreaById(999999);
    expect(area).toBeNull();
  });
});

describe("updateArea (mock)", () => {
  it("debe actualizar un área existente", async () => {
    pool.query["mockResolvedValueOnce"]([{ affectedRows: 1 }]); // updateArea
    pool.query["mockResolvedValueOnce"]([
      [
        {
          id: 1,
          nombre: "NombreActualizado",
          descripcion: "Descripción actualizada",
        },
      ],
    ]); // getAreaById
    const { updateArea, getAreaById } = await import(
      "../services/areasService.js"
    );
    const nuevosDatos = {
      nombre: "NombreActualizado",
      descripcion: "Descripción actualizada",
    };
    await updateArea(1, nuevosDatos);
    const areaActualizada = await getAreaById(1);
    expect(areaActualizada.nombre).toBe(nuevosDatos.nombre);
    expect(areaActualizada.descripcion).toBe(nuevosDatos.descripcion);
  });
});
