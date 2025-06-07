import { describe, it, expect, vi, beforeEach } from "vitest";
import * as facturaService from "../services/facturaService.js";
import * as facturaController from "./facturaController.js";

function mockRes() {
  return {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };
}

describe("facturaController", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getAll", () => {
    it("debe devolver todas las facturas", async () => {
      const mockFacturas = [{ id: 1, descripcion: "Factura 1" }];
      vi.spyOn(facturaService, "getAllFacturas").mockResolvedValue(
        mockFacturas
      );
      const req = {};
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await facturaController.getAll(req, res, next);
      expect(res.json).toHaveBeenCalledWith(mockFacturas);
    });
  });

  describe("getById", () => {
    it("debe devolver la factura si existe", async () => {
      const factura = { id: 1, descripcion: "Factura 1" };
      vi.spyOn(facturaService, "getFacturaById").mockResolvedValue(factura);
      const req = { params: { id: 1 } };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await facturaController.getById(req, res, next);
      expect(res.json).toHaveBeenCalledWith(factura);
    });
    it("debe devolver 404 si no existe", async () => {
      vi.spyOn(facturaService, "getFacturaById").mockResolvedValue(null);
      const req = { params: { id: 99 } };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await facturaController.getById(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Factura no encontrada",
      });
    });
  });

  describe("create", () => {
    it("debe crear una factura y devolverla", async () => {
      const factura = {
        usuarioId: 1,
        descripcion: "Nueva Factura",
        total: 100,
        metodoPago: "tarjeta",
      };
      // @ts-ignore
      vi.spyOn(facturaService, "createFactura").mockResolvedValue(factura);
      const req = { body: factura };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await facturaController.create(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(factura);
    });
  });

  describe("update", () => {
    it("debe actualizar la factura y devolver mensaje", async () => {
      vi.spyOn(facturaService, "updateFactura").mockResolvedValue({
        affectedRows: 1,
      });
      const req = { params: { id: 1 }, body: { descripcion: "Editada" } };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await facturaController.update(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ message: "Factura actualizada" });
    });
  });

  describe("remove", () => {
    it("debe eliminar la factura y devolver mensaje", async () => {
      vi.spyOn(facturaService, "deleteFactura").mockResolvedValue({
        affectedRows: 1,
      });
      const req = { params: { id: 1 } };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await facturaController.remove(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ message: "Factura eliminada" });
    });
  });
});
