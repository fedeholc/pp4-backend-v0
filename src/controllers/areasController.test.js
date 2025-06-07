import { describe, it, expect, vi, beforeEach } from "vitest";
import * as areasService from "../services/areasService.js";
import * as areasController from "./areasController.js";

function mockRes() {
  return {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };
}

describe("areasController", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getAll", () => {
    it("debe devolver todas las áreas", async () => {
      const mockAreas = [{ id: 1, nombre: "Area 1" }];
      vi.spyOn(areasService, "getAllAreas").mockResolvedValue(mockAreas);
      const req = {};
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await areasController.getAll(req, res, next);
      expect(res.json).toHaveBeenCalledWith(mockAreas);
    });
  });

  describe("create", () => {
    it("debe crear un área y devolverla", async () => {
      const area = { nombre: "Nueva Área" };
      vi.spyOn(areasService, "createArea").mockResolvedValue(area);
      const req = { body: area };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await areasController.create(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(area);
    });
  });

  describe("getById", () => {
    it("debe devolver el área si existe", async () => {
      const area = { id: 1, nombre: "Area 1" };
      vi.spyOn(areasService, "getAreaById").mockResolvedValue(area);
      const req = { params: { id: 1 } };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await areasController.getById(req, res, next);
      expect(res.json).toHaveBeenCalledWith(area);
    });
    it("debe devolver 404 si no existe", async () => {
      vi.spyOn(areasService, "getAreaById").mockResolvedValue(null);
      const req = { params: { id: 99 } };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await areasController.getById(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Área no encontrada" });
    });
  });

  describe("update", () => {
    it("debe actualizar el área y devolver mensaje", async () => {
      vi.spyOn(areasService, "updateArea").mockResolvedValue();
      const req = { params: { id: 1 }, body: { nombre: "Editada" } };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await areasController.update(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ message: "Área actualizada" });
    });
  });

  describe("remove", () => {
    it("debe eliminar el área y devolver mensaje", async () => {
      vi.spyOn(areasService, "deleteArea").mockResolvedValue({
        affectedRows: 1,
      });
      const req = { params: { id: 1 } };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await areasController.remove(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ message: "Área eliminada" });
    });
  });
});
