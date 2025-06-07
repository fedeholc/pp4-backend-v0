import { describe, it, expect, vi, beforeEach } from "vitest";
import * as tecnicoService from "../services/tecnicoService.js";
import * as tecnicoController from "./tecnicoController.js";

function mockRes() {
  return {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };
}

describe("tecnicoController", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("getAll debe devolver todos", async () => {
    const mockData = [{ id: 1, nombre: "Juan" }];
    vi.spyOn(tecnicoService, "getAllTecnicos").mockResolvedValue(mockData);
    const req = {};
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await tecnicoController.getAll(req, res, next);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("getById debe devolver uno", async () => {
    const item = { id: 1, nombre: "Juan" };
    vi.spyOn(tecnicoService, "getTecnicoById").mockResolvedValue(item);
    const req = { params: { id: 1 } };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await tecnicoController.getById(req, res, next);
    expect(res.json).toHaveBeenCalledWith(item);
  });

  it("create debe crear uno", async () => {
    const item = { usuarioId: 1, nombre: "Juan", apellido: "Pérez" };
    vi.spyOn(tecnicoService, "createTecnico").mockResolvedValue({
      id: 2,
      ...item,
    });
    const req = { body: item };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await tecnicoController.create(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 2, ...item });
  });

  it("update debe actualizar uno", async () => {
    vi.spyOn(tecnicoService, "updateTecnico").mockResolvedValue({
      affectedRows: 1,
    });
    const req = { params: { id: 1 }, body: { nombre: "Editado" } };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await tecnicoController.update(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ message: "Técnico actualizado" });
  });

  it("remove debe eliminar uno", async () => {
    vi.spyOn(tecnicoService, "deleteTecnico").mockResolvedValue({
      affectedRows: 1,
    });
    const req = { params: { id: 1 } };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await tecnicoController.remove(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ message: "Técnico eliminado" });
  });
});
