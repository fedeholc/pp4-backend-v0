import { describe, it, expect, vi, beforeEach } from "vitest";
import * as clienteService from "../services/clienteService.js";
import * as clienteController from "./clienteController.js";

function mockRes() {
  return {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };
}

describe("clienteController", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getAll", () => {
    it("debe devolver todos los clientes", async () => {
      const mockClientes = [{ id: 1, nombre: "Juan" }];
      vi.spyOn(clienteService, "getAllClientes").mockResolvedValue(
        mockClientes
      );
      const req = {};
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await clienteController.getAll(req, res, next);
      expect(res.json).toHaveBeenCalledWith(mockClientes);
    });
  });

  describe("getById", () => {
    it("debe devolver el cliente si existe", async () => {
      const cliente = { id: 1, nombre: "Juan" };
      vi.spyOn(clienteService, "getClienteById").mockResolvedValue(cliente);
      const req = { params: { id: 1 } };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await clienteController.getById(req, res, next);
      expect(res.json).toHaveBeenCalledWith(cliente);
    });
    it("debe devolver 404 si no existe", async () => {
      vi.spyOn(clienteService, "getClienteById").mockResolvedValue(null);
      const req = { params: { id: 99 } };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await clienteController.getById(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Cliente no encontrado",
      });
    });
  });

  describe("create", () => {
    it("debe crear un cliente y devolverlo", async () => {
      const cliente = { usuarioId: 1, nombre: "Juan", apellido: "Pérez" };
      vi.spyOn(clienteService, "createCliente").mockResolvedValue(cliente);
      const req = { body: cliente };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await clienteController.create(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(cliente);
    });
    it("debe devolver 400 si faltan datos requeridos", async () => {
      const req = { body: { nombre: "Juan" } };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await clienteController.create(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Faltan datos requeridos",
      });
    });
  });

  describe("update", () => {
    it("debe actualizar el cliente y devolver mensaje", async () => {
      vi.spyOn(clienteService, "updateCliente").mockResolvedValue(undefined);
      const req = { params: { id: 1 }, body: { nombre: "Editado" } };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await clienteController.update(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ message: "Cliente actualizado" });
    });
  });

  describe("remove", () => {
    it("debe eliminar el cliente y devolver mensaje", async () => {
      vi.spyOn(clienteService, "deleteCliente").mockResolvedValue(undefined);
      const req = { params: { id: 1 } };
      const res = mockRes();
      const next = vi.fn();
      // @ts-ignore
      await clienteController.remove(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ message: "Cliente eliminado" });
    });
  });
});
