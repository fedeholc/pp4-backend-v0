import { describe, it, expect, vi, beforeEach } from "vitest";
import * as pedidoCandidatosService from "../services/pedidoCandidatosService.js";
import * as pedidoCandidatosController from "./pedidoCandidatosController.js";

function mockRes() {
  return {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };
}

describe("pedidoCandidatosController", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("getAll debe devolver todos los candidatos", async () => {
    const mockData = [{ id: 1, pedidoId: 1, tecnicoId: 1 }];
    vi.spyOn(
      pedidoCandidatosService,
      "getAllPedidoCandidatos"
    ).mockResolvedValue(mockData);
    const req = {};
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await pedidoCandidatosController.getAll(req, res, next);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("getById debe devolver un candidato", async () => {
    const candidato = { id: 1, pedidoId: 1, tecnicoId: 1 };
    vi.spyOn(
      pedidoCandidatosService,
      "getPedidoCandidatosById"
    ).mockResolvedValue(candidato);
    const req = { params: { id: 1 } };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await pedidoCandidatosController.getById(req, res, next);
    expect(res.json).toHaveBeenCalledWith(candidato);
  });

  it("create debe crear un candidato", async () => {
    const candidato = { pedidoId: 2, tecnicoId: 2 };
    vi.spyOn(
      pedidoCandidatosService,
      "createPedidoCandidatos"
    ).mockResolvedValue({ id: 2, ...candidato });
    const req = { body: candidato };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await pedidoCandidatosController.create(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 2, ...candidato });
  });

  it("update debe actualizar un candidato", async () => {
    vi.spyOn(
      pedidoCandidatosService,
      "updatePedidoCandidatos"
    ).mockResolvedValue({ affectedRows: 1 });
    const req = { params: { id: 1 }, body: { pedidoId: 1, tecnicoId: 1 } };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await pedidoCandidatosController.update(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      message: "PedidoCandidatos actualizado",
    });
  });

  it("remove debe eliminar un candidato", async () => {
    vi.spyOn(
      pedidoCandidatosService,
      "deletePedidoCandidatos"
    ).mockResolvedValue({ affectedRows: 1 });
    const req = { params: { id: 1 } };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await pedidoCandidatosController.remove(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      message: "PedidoCandidatos eliminado",
    });
  });
});
