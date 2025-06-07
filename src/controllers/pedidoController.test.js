import { describe, it, expect, vi, beforeEach } from "vitest";
import * as pedidoService from "../services/pedidoService.js";
import * as pedidoController from "./pedidoController.js";

function mockRes() {
  return {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };
}

describe("pedidoController", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("getAll debe devolver todos", async () => {
    const mockData = [{ id: 1, clienteId: 1, estado: "sin_candidatos" }];
    // @ts-ignore
    vi.spyOn(pedidoService, "getAllPedidos").mockResolvedValue(mockData);
    const req = {};
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await pedidoController.getAll(req, res, next);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("getById debe devolver uno", async () => {
    const item = { id: 1, clienteId: 1, estado: "sin_candidatos" };
    // @ts-ignore
    vi.spyOn(pedidoService, "getPedidoById").mockResolvedValue(item);
    const req = { params: { id: 1 } };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await pedidoController.getById(req, res, next);
    expect(res.json).toHaveBeenCalledWith(item);
  });

  it("create debe crear uno", async () => {
    const item = { clienteId: 2, areaId: 1, requerimiento: "Reparar PC" };
    vi.spyOn(pedidoService, "createPedido").mockResolvedValue({
      id: 2,
      ...item,
    });
    const req = { body: item };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await pedidoController.create(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 2, ...item });
  });

  it("update debe actualizar uno", async () => {
    vi.spyOn(pedidoService, "updatePedido").mockResolvedValue({
      affectedRows: 1,
    });
    const req = {
      params: { id: 1 },
      body: { clienteId: 1, estado: "con_candidatos" },
    };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await pedidoController.update(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ message: "Pedido actualizado" });
  });

  it("remove debe eliminar uno", async () => {
    vi.spyOn(pedidoService, "deletePedido").mockResolvedValue({
      affectedRows: 1,
    });
    const req = { params: { id: 1 } };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await pedidoController.remove(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ message: "Pedido eliminado" });
  });
});
