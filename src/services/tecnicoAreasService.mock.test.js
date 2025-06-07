import { describe, expect, it, vi, beforeEach } from "vitest";
import { TecnicoAreaSchema } from "../types/schemas.js";

const mockTecnicoAreas = [
  { id: 1, tecnicoId: 1, areaId: 1 },
  { id: 2, tecnicoId: 2, areaId: 2 },
];

vi.mock("../config/db.js", () => ({
  default: { query: vi.fn() },
}));

let pool;
beforeEach(async () => {
  pool = (await import("../config/db.js")).default;
  pool.query["mockReset"]();
});

describe("getAllTecnicoAreas (mock)", () => {
  it("debe retornar un array de técnico-áreas válidos", async () => {
    pool.query["mockResolvedValueOnce"]([mockTecnicoAreas]);
    const { getAllTecnicoAreas } = await import(
      "../services/tecnicoAreasService.js"
    );
    const tecnicoAreas = await getAllTecnicoAreas();
    expect(Array.isArray(tecnicoAreas)).toBe(true);
    for (const ta of tecnicoAreas) {
      const parsed = TecnicoAreaSchema.safeParse(ta);
      expect(parsed.success).toBe(true);
    }
  });
});

describe("getTecnicoAreaById (mock)", () => {
  it("debe retornar un técnico-área válido si existe", async () => {
    pool.query["mockResolvedValueOnce"]([[mockTecnicoAreas[0]]]);
    const { getTecnicoAreaById } = await import(
      "../services/tecnicoAreasService.js"
    );
    const ta = await getTecnicoAreaById(1);
    expect(ta).toBeTruthy();
    const parsed = TecnicoAreaSchema.safeParse(ta);
    expect(parsed.success).toBe(true);
  });

  it("debe retornar null si no existe", async () => {
    pool.query["mockResolvedValueOnce"]([[]]);
    const { getTecnicoAreaById } = await import(
      "../services/tecnicoAreasService.js"
    );
    const ta = await getTecnicoAreaById(999999);
    expect(ta).toBeNull();
  });
});

describe("createTecnicoArea y deleteTecnicoArea (mock)", () => {
  it("debe crear y luego eliminar un técnico-área", async () => {
    const taPrueba = { id: undefined, tecnicoId: 3, areaId: 3 };
    pool.query["mockResolvedValueOnce"]([{ insertId: 123 }]); // create
    pool.query["mockResolvedValueOnce"]([{ affectedRows: 1 }]); // delete
    const { createTecnicoArea, deleteTecnicoArea } = await import(
      "../services/tecnicoAreasService.js"
    );
    const creada = await createTecnicoArea(taPrueba);
    expect(creada.id).toBeTruthy();
    expect(creada.tecnicoId).toBe(taPrueba.tecnicoId);
    const borrado = await deleteTecnicoArea(creada.id);
    expect(borrado.affectedRows).toBe(1);
  });
});

describe("updateTecnicoArea (mock)", () => {
  it("debe actualizar un técnico-área existente", async () => {
    pool.query["mockResolvedValueOnce"]([{ affectedRows: 1 }]); // update
    const { updateTecnicoArea } = await import(
      "../services/tecnicoAreasService.js"
    );
    const nuevosDatos = { tecnicoId: 5, areaId: 6 };
    const result = await updateTecnicoArea(1, nuevosDatos);
    expect(result.affectedRows).toBe(1);
  });
});
