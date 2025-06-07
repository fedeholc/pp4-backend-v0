import { describe, expect, it, vi, beforeEach } from "vitest";
import { TecnicoSchema } from "../types/schemas.js";

const mockTecnicos = [
  {
    id: 1,
    usuarioId: 1,
    nombre: "Juan",
    apellido: "Pérez",
    telefono: "123456789",
    direccion: "Calle 1",
    caracteristicas: "A",
    fechaRegistro: new Date(),
  },
  {
    id: 2,
    usuarioId: 2,
    nombre: "Ana",
    apellido: "García",
    telefono: "987654321",
    direccion: "Calle 2",
    caracteristicas: "B",
    fechaRegistro: new Date(),
  },
];

vi.mock("../config/db.js", () => ({
  default: { query: vi.fn() },
}));

let pool;
beforeEach(async () => {
  pool = (await import("../config/db.js")).default;
  pool.query["mockReset"]();
});

describe("getAllTecnicos (mock)", () => {
  it("debe retornar un array de técnicos válidos", async () => {
    pool.query["mockResolvedValueOnce"]([mockTecnicos]);
    const { getAllTecnicos } = await import("../services/tecnicoService.js");
    const tecnicos = await getAllTecnicos();
    expect(Array.isArray(tecnicos)).toBe(true);
    for (const tecnico of tecnicos) {
      const parsed = TecnicoSchema.safeParse(tecnico);
      expect(parsed.success).toBe(true);
    }
  });
});

describe("getTecnicoById (mock)", () => {
  it("debe retornar un técnico válido si existe", async () => {
    pool.query["mockResolvedValueOnce"]([[mockTecnicos[0]]]); // tecnico
    pool.query["mockResolvedValueOnce"]([[]]); // pedidos
    pool.query["mockResolvedValueOnce"]([[]]); // areas
    const { getTecnicoById } = await import("../services/tecnicoService.js");
    const tecnico = await getTecnicoById(1);
    expect(tecnico).toBeTruthy();
    const parsed = TecnicoSchema.safeParse(tecnico);
    expect(parsed.success).toBe(true);
  });

  it("debe retornar null si el técnico no existe", async () => {
    pool.query["mockResolvedValueOnce"]([[]]);
    const { getTecnicoById } = await import("../services/tecnicoService.js");
    const tecnico = await getTecnicoById(999999);
    expect(tecnico).toBeNull();
  });
});

describe("createTecnico y deleteTecnico (mock)", () => {
  it("debe crear y luego eliminar un técnico", async () => {
    const tecnicoPrueba = {
      id: undefined,
      usuarioId: 3,
      nombre: "TestNombre",
      apellido: "TestApellido",
      telefono: "123456789",
      direccion: "TestDireccion",
      caracteristicas: "C",
      fechaRegistro: new Date(),
    };
    pool.query["mockResolvedValueOnce"]([{ insertId: 123 }]); // createTecnico
    pool.query["mockResolvedValueOnce"]([{ affectedRows: 1 }]); // deleteTecnico
    const { createTecnico, deleteTecnico } = await import(
      "../services/tecnicoService.js"
    );
    const creada = await createTecnico(tecnicoPrueba);
    expect(creada.id).toBeTruthy();
    expect(creada.nombre).toBe(tecnicoPrueba.nombre);
    const borrado = await deleteTecnico(creada.id);
    expect(borrado.affectedRows).toBe(1);
  });
});

describe("updateTecnico (mock)", () => {
  it("debe actualizar un técnico existente", async () => {
    pool.query["mockResolvedValueOnce"]([{ affectedRows: 1 }]); // updateTecnico
    const { updateTecnico } = await import("../services/tecnicoService.js");
    const nuevosDatos = {
      nombre: "NombreActualizado",
      apellido: "ApellidoActualizado",
      telefono: "999999999",
      direccion: "NuevaDireccion",
      caracteristicas: "Z",
    };
    const result = await updateTecnico(1, nuevosDatos);
    expect(result.affectedRows).toBe(1);
  });
});
