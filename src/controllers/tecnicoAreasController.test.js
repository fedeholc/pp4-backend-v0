import { describe, it, expect, vi, beforeEach } from "vitest";
import * as tecnicoAreasService from "../services/tecnicoAreasService.js";
import * as tecnicoAreasController from "./tecnicoAreasController.js";

function mockRes() {
  return {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };
}

describe("tecnicoAreasController", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("getAll debe devolver todos", async () => {
    const mockData = [{ id: 1, tecnicoId: 1, areaId: 1 }];
    vi.spyOn(tecnicoAreasService, "getAllTecnicoAreas").mockResolvedValue(
      mockData
    );
    const req = {};
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await tecnicoAreasController.getAll(req, res, next);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("getById debe devolver uno", async () => {
    const item = { id: 1, tecnicoId: 1, areaId: 1 };
    vi.spyOn(tecnicoAreasService, "getTecnicoAreaById").mockResolvedValue(item);
    const req = { params: { id: 1 } };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await tecnicoAreasController.getById(req, res, next);
    expect(res.json).toHaveBeenCalledWith(item);
  });

  it("create debe crear uno", async () => {
    const item = { tecnicoId: 2, areaId: 2 };
    vi.spyOn(tecnicoAreasService, "createTecnicoArea").mockResolvedValue({
      id: 2,
      ...item,
    });
    const req = { body: item };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await tecnicoAreasController.create(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 2, ...item });
  });

  it("update debe actualizar uno", async () => {
    vi.spyOn(tecnicoAreasService, "updateTecnicoArea").mockResolvedValue({
      affectedRows: 1,
    });
    const req = { params: { id: 1 }, body: { tecnicoId: 1, areaId: 1 } };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await tecnicoAreasController.update(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      message: "Técnico-Area actualizado",
    });
  });

  it("remove debe eliminar uno", async () => {
    vi.spyOn(tecnicoAreasService, "deleteTecnicoArea").mockResolvedValue({
      affectedRows: 1,
    });
    const req = { params: { id: 1 } };
    const res = mockRes();
    const next = vi.fn();
    // @ts-ignore
    await tecnicoAreasController.remove(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      message: "Técnico-Area eliminado",
    });
  });
});
