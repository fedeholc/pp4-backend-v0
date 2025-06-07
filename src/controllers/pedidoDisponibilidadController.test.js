import { describe, it, expect, vi, beforeEach } from "vitest";
import * as pedidoDisponibilidadService from "../services/pedidoDisponibilidadService.js";
import * as pedidoDisponibilidadController from "./pedidoDisponibilidadController.js";

function mockRes() {
  return {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };
}

describe("pedidoDisponibilidadController", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("getAll debe devolver todos", async () => {
    const mockData = [{ id: 1, pedidoId: 1, clienteId: 1 }];
    vi.spyOn(
      pedidoDisponibilidadService,
      "getAllPedidoDisponibilidad"
    ).mockResolvedValue(mockData);
    const req = {};
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await pedidoDisponibilidadController.getAll(req, res, next);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("getById debe devolver uno", async () => {
    const item = { id: 1, pedidoId: 1, clienteId: 1 };
    vi.spyOn(
      pedidoDisponibilidadService,
      "getPedidoDisponibilidadById"
    ).mockResolvedValue(item);
    const req = { params: { id: 1 } };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await pedidoDisponibilidadController.getById(req, res, next);
    expect(res.json).toHaveBeenCalledWith(item);
  });

  it("create debe crear uno", async () => {
    vi.spyOn(
      pedidoDisponibilidadService,
      "createPedidoDisponibilidad"
    ).mockResolvedValue({ id: 2, clienteId: 1, pedidoId: 1, dia: "lunes" });
    const req = { body: { clienteId: 1, pedidoId: 1, dia: "lunes" } };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await pedidoDisponibilidadController.create(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 2,
      clienteId: 1,
      pedidoId: 1,
      dia: "lunes",
    });
  });

  it("update debe actualizar uno", async () => {
    vi.spyOn(
      pedidoDisponibilidadService,
      "updatePedidoDisponibilidad"
    ).mockResolvedValue({ affectedRows: 1 });
    const req = { params: { id: 1 }, body: { pedidoId: 1, clienteId: 1 } };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await pedidoDisponibilidadController.update(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      message: "PedidoDisponibilidad actualizado",
    });
  });

  it("remove debe eliminar uno", async () => {
    vi.spyOn(
      pedidoDisponibilidadService,
      "deletePedidoDisponibilidad"
    ).mockResolvedValue({ affectedRows: 1 });
    const req = { params: { id: 1 } };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await pedidoDisponibilidadController.remove(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      message: "PedidoDisponibilidad eliminado",
    });
  });
});
