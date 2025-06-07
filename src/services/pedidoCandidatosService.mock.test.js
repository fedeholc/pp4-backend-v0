import { describe, expect, it, vi, beforeEach } from "vitest";
// Ajusta el import del schema si tienes uno específico para PedidoCandidatos
// import { PedidoCandidatosSchema } from "../types/schemas.js";

const mockCandidatos = [
  { id: 1, pedidoId: 1, tecnicoId: 1 },
  { id: 2, pedidoId: 2, tecnicoId: 2 },
];

vi.mock("../config/db.js", () => ({
  default: { query: vi.fn() },
}));

let pool;
beforeEach(async () => {
  pool = (await import("../config/db.js")).default;
  pool.query["mockReset"]();
});

describe("getAllPedidoCandidatos (mock)", () => {
  it("debe retornar un array de candidatos válidos", async () => {
    pool.query["mockResolvedValueOnce"]([mockCandidatos]);
    const { getAllPedidoCandidatos } = await import(
      "../services/pedidoCandidatosService.js"
    );
    const candidatos = await getAllPedidoCandidatos();
    expect(Array.isArray(candidatos)).toBe(true);
    // Aquí podrías validar con un schema si tienes uno
  });
});
